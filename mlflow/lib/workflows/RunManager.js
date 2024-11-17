import RunClient from '../tracking/RunClient.js';
import ModelVersionClient from '../model-registry/ModelVersionClient.js';
import { ApiError } from '../utils/apiError.js';
class RunManager {
    constructor(trackingUri) {
        this.runClient = new RunClient(trackingUri);
        this.modelVersion = new ModelVersionClient(trackingUri);
    }
    /**
     * Delete runs that do not meet certain criteria and return deleted runs.
     * Dry run is set to true by default. To delete, set dry run to false.
     *
     * @param {Array<string>} [experiment_ids] - The IDs of the associated experiments. (required)
     * @param {string} query_string - SQL-like query string to filter runs to keep. (required)
     * @param {string} metric_key - The metric key for comparison. (required)
     * @param {boolean} [dryRun=true] - If true, only simulate the deletion. Defaults to true. (optional)
     * @returns {Promise<DeletedRuns>} - An object of deleted runs.
     */
    async cleanupRuns(experiment_ids, query_string, metric_key, dryRun = true) {
        var _a;
        const deletedRuns = [];
        const keepRunIds = new Set();
        const runViewType = undefined;
        let pageToken = undefined;
        const maxResults = 1000;
        try {
            do {
                // get all runs
                const searchResult = (await this.runClient.searchRuns(experiment_ids, '', runViewType, maxResults, ['start_time DESC'], pageToken));
                // get runs that match the keep crteria
                const keepRunsResult = (await this.runClient.searchRuns(experiment_ids, query_string, runViewType, maxResults, ['start_time DESC'], pageToken));
                // Add runs from keepRunsResult to keepResult
                (_a = keepRunsResult.runs) === null || _a === void 0 ? void 0 : _a.forEach((run) => keepRunIds.add(run.info.run_id));
                // Process each run
                for (const run of searchResult.runs) {
                    const metrics = run.data.metrics;
                    const hasMetricKey = Array.isArray(metrics)
                        ? metrics.some((metric) => metric.key === metric_key)
                        : metric_key in metrics;
                    if (!hasMetricKey || keepRunIds.has(run.info.run_id)) {
                        keepRunIds.add(run.info.run_id);
                    }
                    else {
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
        }
        catch (error) {
            if (error instanceof ApiError) {
                console.error(`API Error (${error.statusCode}): ${error.message}`);
            }
            else {
                console.error('An unexpected error occurred: ', error);
            }
            throw error;
        }
    }
    /**
     * Copy run from one experiment to another without artifactss and models.
     * Artifacts and models detail tagged in new run as reference.
     *
     * @param {string} run_id - The ID of the run to be copied. (required)
     * @param {string} target_experiment_id - The ID of the target experiment. (required)
     * @param {string} run_name - The name of the new run in target experiment. (optional)
     * @returns {Promise<CopiedRun>} - An object detail of the copied run.
     */
    async copyRun(run_id, target_experiment_id, run_name = null) {
        try {
            // get original run
            const originalRun = (await this.runClient.getRun(run_id));
            // create a new run in the target experiment
            const newRun = (await this.runClient.createRun(target_experiment_id, undefined, originalRun.info.start_time));
            const newRunId = newRun.info.run_id;
            const endTime = originalRun.info.end_time || undefined;
            // copy run information
            await this.runClient.updateRun(newRunId, originalRun.info.status, endTime);
            if (originalRun.info.lifecycle_stage !== 'active') {
                await this.runClient.setTag(newRunId, 'mlflow.lifecycleStage', originalRun.info.lifecycle_stage);
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
            if (originalRun.inputs &&
                originalRun.inputs.dataset_inputs &&
                originalRun.inputs.dataset_inputs.length > 0) {
                // Log each dataset input separately
                for (const datasetInput of originalRun.inputs.dataset_inputs) {
                    await this.runClient.logInputs(newRunId, [datasetInput]);
                }
            }
            // update the new run name
            if (run_name) {
                await this.runClient.setTag(newRunId, 'mlflow.runName', run_name);
            }
            // handle models (reference only)
            const modelVersions = await this.modelVersion.searchModelVersions(`run_id = '${run_id}'`);
            if (modelVersions && modelVersions.length > 0) {
                for (const model of modelVersions) {
                    if (typeof model === 'object' &&
                        model !== null &&
                        'name' in model &&
                        'version' in model &&
                        'current_stage' in model &&
                        'source' in model) {
                        await this.runClient.setTag(newRunId, `original_model_${model.name}`, JSON.stringify({
                            name: model.name,
                            version: model.version,
                            current_stage: model.current_stage,
                            source: model.source,
                        }));
                    }
                }
                await this.runClient.setTag(newRunId, 'mlflow.note.models', 'Models not copied, see original run.');
            }
            // set description for the new run
            const description = `This run was copied from experiment ${originalRun.info.experiment_id}, original run ID: ${run_id}. ` +
                `Original artifact URI: ${originalRun.info.artifact_uri}.`;
            await this.runClient.setTag(newRunId, 'mlflow.note.content', description);
            // set additional tags for the new run
            await this.runClient.setTag(newRunId, 'mlflow.source.run_id', run_id);
            await this.runClient.setTag(newRunId, 'mlflow.source.experiment_id', originalRun.info.experiment_id);
            await this.runClient.setTag(newRunId, 'mlflow.note.artifacts', 'Artifacts not copied - reference original run');
            // return copy run details
            return {
                originalRunId: run_id,
                newRunId: newRunId,
                targetExperimentId: target_experiment_id,
            };
        }
        catch (error) {
            if (error instanceof ApiError) {
                console.error(`API Error (${error.statusCode}): ${error.message}`);
            }
            else {
                console.error('An unexpected error occurred: ', error);
            }
            throw error;
        }
    }
}
export default RunManager;
//# sourceMappingURL=RunManager.js.map