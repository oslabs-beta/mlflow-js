import { RunManagement } from '../tracking_server/run_management.js';
import { ModelVersionManagement } from '../model_registry/model_version_management.js';

class Abstraction {
  constructor(trackingUri) {
    this.trackingUri = trackingUri;
    this.RunManagement = new RunManagement(this.trackingUri);
    this.ModelVersionManagement = new ModelVersionManagement(this.trackingUri);
  }

  /**
   * Delete runs that do not meet certain criteria and return the deleted runs.
   *
   * @param {string[]} experimentIds - The IDs of the associated experiments. (required)
   * @param {string} queryString - SQL-like query string to filter runs to keep. (required)
   * @param {boolean} [dryRun=true] - If true, only simulate the deletion. Defaults to true. (optional)
   * @returns {Promise<Object>} - An object of deleted runs.
   */
  async runCleanup(experimentIds, queryString, dryRun = true) {
    const deletedRuns = [];
    let pageToken = null;
    const maxResults = 1000;

    try {
      do {
        // get all runs
        const searchResult = await this.RunManagement.searchRuns(
          experimentIds,
          '',
          null, // run_view_type
          maxResults,
          ['start_time DESC'],
          pageToken
        );

        // get runs that match the keep crteria
        const keepResult = await this.RunManagement.searchRuns(
          experimentIds,
          queryString,
          null, // run_view_type
          maxResults,
          ['start_time DESC'],
          pageToken
        );

        // create a Set of run IDs to keep for efficient lookup
        const keepRunIds = new Set(
          keepResult.runs.map((run) => run.info.run_id)
        );

        // check for runs that are not in keepRunIds
        // if dryRun is false, delete from database, push to deletedRuns array
        // if dryRun is true, push to deletedRuns array
        for (const run of searchResult.runs || []) {
          if (!keepRunIds.has(run.info.run_id)) {
            if (!dryRun) {
              await this.RunManagement.deleteRun(run.info.run_id);
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
   * Move run from one experiment to another without artifactss and models. Artifacts and models detail tagged in new run as reference.
   *
   * @param {string} runId - The ID of the run to be moved. (required)
   * @param {string} targetExperimentId - The ID of the target experiment. (required)
   * @param {string} runName - The name of the new run in target experiment. (optional)
   * @returns {Promise<Object>} - An object of move run detail.
   */
  async moveRun(runId, targetExperimentId, runName = null) {
    try {
      // get original run
      const originalRun = await this.RunManagement.getRun(runId);

      // create a new run in the target experiment
      const newRun = await this.RunManagement.createRun(
        targetExperimentId,
        null,
        originalRun.info.start_time
      );

      const newRunId = newRun.info.run_id;

      // copy run information
      await this.RunManagement.updateRun(newRunId, originalRun.info.status);
      if (originalRun.info.lifecycle_stage !== 'active') {
        await this.RunManagement.setTag(
          newRunId,
          'mlflow.lifecycleStage',
          originalRun.info.lifecycle_stage
        );
      }

      // copy parameters
      if (originalRun.data.params) {
        for (const param of originalRun.data.params) {
          await this.RunManagement.logParam(newRunId, param.key, param.value);
        }
      }

      // copy metrics
      if (originalRun.data.metrics) {
        for (const metric of originalRun.data.metrics) {
          await this.RunManagement.logMetric(
            newRunId,
            metric.key,
            metric.value
          );
        }
      }

      // copy tags
      if (originalRun.data.tags) {
        for (const tag of originalRun.data.tags) {
          await this.RunManagement.setTag(newRunId, tag.key, tag.value);
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
          await this.RunManagement.logInputs(newRunId, [datasetInput]);
        }
      }

      // update the new run name
      if (runName) {
        await this.RunManagement.setTag(newRunId, 'mlflow.runName', runName);
      }

      // handle models (reference only)
      const modelVersions =
        await this.ModelVersionManagement.searchModelVersions(
          `run_id = '${runId}'`
        );
      if (modelVersions && modelVersions.length > 0) {
        for (const model of modelVersions) {
          await this.RunManagement.setTag(
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
        await this.RunManagement.setTag(
          newRunId,
          'mlflow.note.models',
          'Models not moved -see original run'
        );
      }

      // update the original run
      await this.RunManagement.updateRun(runId, 'FINISHED', null, Date.now());

      // set description for the new run
      const description =
        `This run was moved from experiment ${originalRun.info.experiment_id}, original run ID: ${runId}. ` +
        `Original artifact URI: ${originalRun.info.artifact_uri}.`;

      await this.RunManagement.setTag(
        newRunId,
        'mlflow.note.content',
        description
      );

      // set additional tags for the new run
      await this.RunManagement.setTag(newRunId, 'mlflow.source.run_id', runId);

      await this.RunManagement.setTag(
        newRunId,
        'mlflow.source.experiment_id',
        originalRun.info.experiment_id
      );

      await this.RunManagement.setTag(
        newRunId,
        'mlflow.note.artifacts',
        'Artifacts not moved - reference original run'
      );

      // return object with move run details
      return {
        originalRunId: runId,
        newRunId: newRunId,
        targetExperimentId: targetExperimentId,
      };
    } catch (error) {
      console.error('Error moving run: ', error);
      throw new Error('Failed to move run.');
    }
  }

  /********************************************************************************************************** */

  /**
   * Search runs and  export run data to CSV.
   *
   * @param {string[]} experimentIds - The IDs of the associated experiments. (required)
   * @param {string} queryString - SQL-like query string to filter runs to keep. (required)
   * @returns {Promise<Object>} - An object of run datas in CSV format.
   */
  async convertRunDataToCSV() {}
}

export { Abstraction };
