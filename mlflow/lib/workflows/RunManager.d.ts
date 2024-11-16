declare class RunManager {
    private runClient;
    private modelVersion;
    constructor(trackingUri: string);
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
    cleanupRuns(experiment_ids: Array<string>, query_string: string, metric_key: string, dryRun?: boolean): Promise<object>;
    /**
     * Copy run from one experiment to another without artifactss and models.
     * Artifacts and models detail tagged in new run as reference.
     *
     * @param {string} run_id - The ID of the run to be copied. (required)
     * @param {string} target_experiment_id - The ID of the target experiment. (required)
     * @param {string} run_name - The name of the new run in target experiment. (optional)
     * @returns {Promise<CopiedRun>} - An object detail of the copied run.
     */
    copyRun(run_id: string, target_experiment_id: string, run_name?: null): Promise<object>;
}
export default RunManager;
