import RunClient from '@tracking/RunClient';
import ModelVersionClient from '@model-registry/ModelVersionClient';
import { Run, SearchedRuns } from '@utils/interface';
import { ApiError } from '@utils/apiError';

class RunManager {
  private runClient: RunClient;
  private modelVersion: ModelVersionClient;

  constructor(trackingUri: string) {
    this.runClient = new RunClient(trackingUri);
    this.modelVersion = new ModelVersionClient(trackingUri);
  }

  /**
   * Delete runs that do not meet certain criteria and return deleted runs.
   * Dry run is set to true by default. To delete, set dry run to false.
   *
   * @param {Array<string>} [experimentIds] - The IDs of the associated experiments. (required)
   * @param {string} query_string - SQL-like query string to filter runs to keep. (required)
   * @param {string} metric_key - The metric key for comparison. (required)
   * @param {boolean} [dryRun=true] - If true, only simulate the deletion. Defaults to true. (optional)
   * @returns {Promise<DeletedRuns>} - An object of deleted runs.
   */
  async cleanupRuns(
    experimentIds: Array<string>,
    query_string: string,
    metric_key: string,
    dryRun = true
  ): Promise<object> {
    const deletedRuns = [];
    const keepRunIds = new Set();
    const runViewType = undefined;
    let pageToken = undefined;
    const maxResults = 1000;

    try {
      do {
        // get all runs
        const searchResult = (await this.runClient.searchRuns(
          experimentIds,
          '',
          runViewType,
          maxResults,
          ['start_time DESC'],
          pageToken
        )) as SearchedRuns;

        // get runs that match the keep crteria
        const keepRunsResult = (await this.runClient.searchRuns(
          experimentIds,
          query_string,
          runViewType,
          maxResults,
          ['start_time DESC'],
          pageToken
        )) as SearchedRuns;

        // Add runs from keepRunsResult to keepResult
        keepRunsResult.runs?.forEach((run: Run) =>
          keepRunIds.add(run.info.run_id)
        );

        // Process each run
        for (const run of searchResult.runs) {
          const metrics = run.data.metrics;
          const hasMetricKey = Array.isArray(metrics)
            ? metrics.some((metric) => metric.key === metric_key)
            : metric_key in metrics;

          if (!hasMetricKey || keepRunIds.has(run.info.run_id)) {
            keepRunIds.add(run.info.run_id);
          } else {
            deletedRuns.push(run);
            if (!dryRun) {
              await this.runClient.deleteRun(run.info.run_id);
            }
          }
        }
        pageToken = searchResult.next_page_token;
      } while (pageToken);

      return {
        deletedRuns: deletedRuns,
        total: deletedRuns.length,
        dryRun,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error (${error.statusCode}): ${error.message}`);
      } else {
        console.error('An unexpected error occurred: ', error);
      }
      throw error;
    }
  }

  /**
   * Copy run from one experiment to another without artifactss and models.
   * Artifacts and models detail tagged in new run as reference.
   *
   * @param {string} runId - The ID of the run to be copied. (required)
   * @param {string} targetExperimentId - The ID of the target experiment. (required)
   * @param {string} runName - The name of the new run in target experiment. (optional)
   * @returns {Promise<CopiedRun>} - An object detail of the copied run.
   */
  async copyRun(
    runId: string,
    targetExperimentId: string,
    runName = null
  ): Promise<object> {
    try {
      // get original run
      const originalRun = (await this.runClient.getRun(runId)) as Run;

      // create a new run in the target experiment
      const newRun = (await this.runClient.createRun(
        targetExperimentId,
        undefined,
        originalRun.info.start_time
      )) as Run;

      const newRunId = newRun.info.run_id;

      const endTime = originalRun.info.end_time || undefined;

      // copy run information
      await this.runClient.updateRun(
        newRunId,
        originalRun.info.status,
        endTime
      );

      if (originalRun.info.lifecycle_stage !== 'active') {
        await this.runClient.setTag(
          newRunId,
          'mlflow.lifecycleStage',
          originalRun.info.lifecycle_stage
        );
      }

      // copy parameters
      if (originalRun.data.params) {
        for (const param of originalRun.data.params) {
          await this.runClient.logParam(newRunId, param.key, param.value);
        }
      }

      // copy metrics
      if (originalRun.data.metrics) {
        for (const metric of originalRun.data.metrics) {
          await this.runClient.logMetric(newRunId, metric.key, metric.value);
        }
      }

      // copy tags
      if (originalRun.data.tags) {
        for (const tag of originalRun.data.tags) {
          await this.runClient.setTag(newRunId, tag.key, tag.value);
        }
      }

      // copy inputs
      if (
        originalRun.inputs &&
        originalRun.inputs.dataset_inputs &&
        originalRun.inputs.dataset_inputs.length > 0
      ) {
        // Log each dataset input separately
        for (const datasetInput of originalRun.inputs.dataset_inputs) {
          await this.runClient.logInputs(newRunId, [datasetInput]);
        }
      }

      // update the new run name
      if (runName) {
        await this.runClient.setTag(newRunId, 'mlflow.runName', runName);
      }

      // handle models (reference only)
      const modelVersions = await this.modelVersion.searchModelVersions(
        `run_id = '${runId}'`
      );
      if (modelVersions && modelVersions.length > 0) {
        for (const model of modelVersions) {
          if (
            typeof model === 'object' &&
            model !== null &&
            'name' in model &&
            'version' in model &&
            'current_stage' in model &&
            'source' in model
          ) {
            await this.runClient.setTag(
              newRunId,
              `original_model_${model.name}`,
              JSON.stringify({
                name: model.name,
                version: model.version,
                current_stage: model.current_stage,
                source: model.source,
              })
            );
          }
        }
        await this.runClient.setTag(
          newRunId,
          'mlflow.note.models',
          'Models not copied, see original run.'
        );
      }

      // set description for the new run
      const description =
        `This run was copied from experiment ${originalRun.info.experiment_id}, original run ID: ${runId}. ` +
        `Original artifact URI: ${originalRun.info.artifact_uri}.`;

      await this.runClient.setTag(newRunId, 'mlflow.note.content', description);

      // set additional tags for the new run
      await this.runClient.setTag(newRunId, 'mlflow.source.run_id', runId);

      await this.runClient.setTag(
        newRunId,
        'mlflow.source.experiment_id',
        originalRun.info.experiment_id
      );

      await this.runClient.setTag(
        newRunId,
        'mlflow.note.artifacts',
        'Artifacts not copied - reference original run'
      );

      // return copy run details
      return {
        originalRunId: runId,
        newRunId: newRunId,
        targetExperimentId: targetExperimentId,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error (${error.statusCode}): ${error.message}`);
      } else {
        console.error('An unexpected error occurred: ', error);
      }
      throw error;
    }
  }
}

export default RunManager;
