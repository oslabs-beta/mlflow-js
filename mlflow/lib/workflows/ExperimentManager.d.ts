declare class ExperimentManager {
    private experimentClient;
    private runClient;
    constructor(trackingUri: string);
    /**
     * Full workflow of creating, naming and starting a run under an existing experiment (referenced by ID),
     * logging metrics, params, and tags, logging the model, and finishing the run.
     *
     * @param {string} experiment_id ID of the experiment under which to log the run.  (required)
     * @param {string} run_name Name of the run to be created and run (optional)
     * @param {Array<{key: string, value: number, timestamp: number, step?: number}>} [metrics] The metrics to log (up to 1000 metrics) (optional)
     * @param {Array<{key: string, value: string}>} [params] The params to log (up to 100 params) (optional)
     * @param {Array<{key: string, value: string}>} [tags] The tags to log (up to 100 tags) (optional)
     * @param {{artifact_path: string, flavors: Object, model_url: string, model_uuid: string, utc_time_created: number, mlflow_version: string}} model The ML model data to log to the run, represented as a Javascript object (optional)
     * @returns {Promise<Object>} The created run object with updated metadata
     */
    runExistingExperiment(experiment_id: string, run_name?: string, metrics?: Array<{
        key: string;
        value: number;
        timestamp: number;
        step?: number;
    }>, params?: Array<{
        key: string;
        value: string;
    }>, tags?: Array<{
        key: string;
        value: string;
    }>, model?: {
        artifact_path: string;
        flavors: object;
        model_url: string;
        model_uuid: string;
        utc_time_created: number;
        mlflow_version: string;
        run_id?: string;
    }): Promise<object>;
    /**
     * Full workflow of creating, naming and starting a run under a new experiment,
     * logging metrics, params, and tags, logging the model, and finishing the run.
     *
     * @param {string} experiment_name Name of the experiment under which to log the run.  (required)
     * @param {string} run_name Name of the run to be created and run (optional)
     * @param {Array<{key: string, value: number, timestamp: number, step?: number}>} [metrics] The metrics to log (up to 1000 metrics) (optional)
     * @param {Array<{key: string, value: string}>} [params] The params to log (up to 100 params) (optional)
     * @param {Array<{key: string, value: string}>} [tags] The tags to log (up to 100 tags) (optional)
     * @param {Object} model The ML model data to log to the run, represented as a Javascript object (optional)
     * @returns {Promise<Object>} The created run object with updated metadata
     */
    runNewExperiment(experiment_name: string, run_name: string, metrics: Array<{
        key: string;
        value: number;
        timestamp: number;
        step?: number;
    }>, params?: Array<{
        key: string;
        value: string;
    }>, tags?: Array<{
        key: string;
        value: string;
    }>, model?: {
        artifact_path: string;
        flavors: object;
        model_url: string;
        model_uuid: string;
        utc_time_created: number;
        mlflow_version: string;
        run_id?: string;
    }): Promise<object>;
    /**
     * Returns an array of all the passed-in experiment's runs, sorted according to the passed-in metric
     *
     * @param {string} experiment_id The experiment whose runs will be evaluated (required)
     * @param {string} primaryMetric The metric by which the results array will be sorted (required)
     * @param {string | number} order Sort order for the array: pass in 'DESC' or 1 for descending; 'ASC' or -1 for ascending
     * @returns {Promise<Array<Object>>} An array of run objects belonging to the passed-in experiment ID, sorted according to the primary metric
     */
    experimentSummary(experiment_id: string, primaryMetric: string, order?: 'ASC' | 'DESC' | 1 | -1): Promise<Array<object>>;
}
export default ExperimentManager;
