import { RunClient } from '../tracking/RunClient.js';
import { ModelVersionManagement } from '../model-registry/model_version_management.js';

class RunManager {
  constructor(trackingUri) {
    this.trackingUri = trackingUri;
    this.RunClient = new RunClient(this.trackingUri);
    this.ModelVersionManagement = new ModelVersionManagement(this.trackingUri);
  }

  /**
   * Delete runs that do not meet certain criteria and return deleted runs.
   * Dry run is set to true by default. To delete, set dry run to false.
   *
   * @param {string[]} experimentIds - The IDs of the associated experiments. (required)
   * @param {string} queryString - SQL-like query string to filter runs to keep. (required)
   * @param {boolean} [dryRun=true] - If true, only simulate the deletion. Defaults to true. (optional)
   * @returns {Promise<Object>} - An object of deleted runs.
   */
  async cleanupRuns(experimentIds, queryString, metricKey, dryRun = true) {
    const deletedRuns = [];
    const keepRunIds = new Set();
    let pageToken = null;
    const maxResults = 1000;

    try {
      do {
        // get all runs
        const searchResult = await this.RunClient.searchRuns(
          experimentIds,
          '',
          null, // run_view_type
          maxResults,
          ['start_time DESC'],
          pageToken
        );

        // get runs that match the keep crteria
        const keepRunsResult = await this.RunClient.searchRuns(
          experimentIds,
          queryString,
          null, // run_view_type
          maxResults,
          ['start_time DESC'],
          pageToken
        );

        // Add runs from keepRunsResult to keepResult
        keepRunsResult.runs.forEach((run) => keepRunIds.add(run.info.run_id));

        // Add runs without the specified metric key to keepRunIds
        for (const run of searchResult.runs) {
          if (Array.isArray(run.data.metrics)) {
            const hasMetricKey = run.data.metrics.some(
              (metric) => metric.key === metricKey
            );
            if (!hasMetricKey) {
              keepRunIds.add(run.info.run_id);
            }
          } else {
            // If run.data.metrics is not an array (e.g., undefined), keep the run
            keepRunIds.add(run.info.run_id);
          }
        }

        // Delete runs that are not in keepRunIds
        for (const run of searchResult.runs) {
          if (!keepRunIds.has(run.info.run_id)) {
            if (!dryRun) {
              await this.RunClient.deleteRun(run.info.run_id);
            }
            deletedRuns.push(run);
          }
        }

        pageToken = searchResult.page_token;
      } while (pageToken);
    } catch (error) {
      console.error('Error during run cleanup: ', error);
      throw new Error('Failed to cleanup runs.');
    }
    return { deletedRuns, total: deletedRuns.length, dryRun };
  }

  /********************************************************************************************************** */

  /**
   * Copy run from one experiment to another without artifactss and models.
   * Artifacts and models detail tagged in new run as reference.
   *
   * @param {string} runId - The ID of the run to be copied. (required)
   * @param {string} targetExperimentId - The ID of the target experiment. (required)
   * @param {string} runName - The name of the new run in target experiment. (optional)
   * @returns {Promise<Object>} - An object detail of the copied run.
   */
  async copyRun(runId, targetExperimentId, runName = null) {
    try {
      // get original run
      const originalRun = await this.RunClient.getRun(runId);

      // create a new run in the target experiment
      const newRun = await this.RunClient.createRun(
        targetExperimentId,
        null,
        originalRun.info.start_time
      );

      const newRunId = newRun.info.run_id;

      const endTime = originalRun.info.end_time || undefined;

      // copy run information
      await this.RunClient.updateRun(
        newRunId,
        originalRun.info.status,
        endTime
      );
      if (originalRun.info.lifecycle_stage !== 'active') {
        await this.RunClient.setTag(
          newRunId,
          'mlflow.lifecycleStage',
          originalRun.info.lifecycle_stage
        );
      }

      // copy parameters
      if (originalRun.data.params) {
        for (const param of originalRun.data.params) {
          await this.RunClient.logParam(newRunId, param.key, param.value);
        }
      }

      // copy metrics
      if (originalRun.data.metrics) {
        for (const metric of originalRun.data.metrics) {
          await this.RunClient.logMetric(newRunId, metric.key, metric.value);
        }
      }

      // copy tags
      if (originalRun.data.tags) {
        for (const tag of originalRun.data.tags) {
          await this.RunClient.setTag(newRunId, tag.key, tag.value);
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
          await this.RunClient.logInputs(newRunId, [datasetInput]);
        }
      }

      // update the new run name
      if (runName) {
        await this.RunClient.setTag(newRunId, 'mlflow.runName', runName);
      }

      // handle models (reference only)
      const modelVersions =
        await this.ModelVersionManagement.searchModelVersions(
          `run_id = '${runId}'`
        );
      if (modelVersions && modelVersions.length > 0) {
        for (const model of modelVersions) {
          await this.RunClient.setTag(
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
        await this.RunClient.setTag(
          newRunId,
          'mlflow.note.models',
          'Models not copied -see original run'
        );
      }

      // set description for the new run
      const description =
        `This run was copied from experiment ${originalRun.info.experiment_id}, original run ID: ${runId}. ` +
        `Original artifact URI: ${originalRun.info.artifact_uri}.`;

      await this.RunClient.setTag(newRunId, 'mlflow.note.content', description);

      // set additional tags for the new run
      await this.RunClient.setTag(newRunId, 'mlflow.source.run_id', runId);

      await this.RunClient.setTag(
        newRunId,
        'mlflow.source.experiment_id',
        originalRun.info.experiment_id
      );

      await this.RunClient.setTag(
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
      console.error('Error copying run: ', error);
      throw new Error('Failed to copy run.');
    }
  }
}

export { RunManager };
