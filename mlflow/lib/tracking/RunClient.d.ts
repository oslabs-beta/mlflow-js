declare class RunClient {
    private baseUrl;
    constructor(trackingUri: string);
    /**
     * Create a new run within an experiment. A run is usually a single execution of a machine learning or data
     * ETL pipeline. MLflow uses runs to track Param, Metric, and RunTag associated with a single execution.
     *
     * @param {string} experiment_id - ID of the associated experiment. (required)
     * @param {string} run_name - Name of the run.
     * @param {number} start_time - Unix timestamp in milliseconds of when the run started.
     * @param {Array<{ key: string; value: string }>} [tags] - Additional metadata for the run.
     * @returns {Promise<CreatedRun>} A promise that resolves with the created run object.
     * @throws {ApiError} If the API request fails.
     */
    createRun(experiment_id: string, run_name?: string, start_time?: number, tags?: Array<{
        key: string;
        value: string;
    }>): Promise<object>;
    /**
     * Mark a run for deletion.
     *
     * @param {string} run_id - ID of the run to delete. (required)
     * @returns {Promise<Void>} A promise that resolves when the run is deleted.
     * @throws {ApiError} If the API request fails.
     */
    deleteRun(run_id: string): Promise<void>;
    /**
     * Restore a deleted run.
     *
     * @param {string} run_id - ID of the run to restore. (required)
     * @returns {Promise<Void>} A promise that resolves when the run is restored.
     * @throws {ApiError} If the API request fails.
     */
    restoreRun(run_id: string): Promise<void>;
    /**
     * Get metadata, metrics, params, and tags for a run. In the case where multiple metrics with the same key
     * are logged for a run, return only the value with the latest timestamp. If there are multiple values with
     * the latest timestamp, return the maximum of these values.
     *
     * @param {string} run_id - ID of the run to fetch. (required)
     * @returns {Promise<FetchedRun>} A promise that resolves with the fetched run object.
     * @throws {ApiError} If the API request fails
     */
    getRun(run_id: string): Promise<object>;
    /**
     * Update run metadata.
     *
     * @param {string} run_id - ID of the run to update. (required)
     * @param {string} status - Updated status of the run.
     * @param {number} end_time - Unix timestamp in milliseconds of when the run ended.
     * @param {string} run_name - Updated name of the run.
     * @returns {Promise<UpdatedRun>} A promise that resolves with the updated metadata of the run.
     * @throws {ApiError} If the API request fails.
     */
    updateRun(run_id: string, status?: 'RUNNING' | 'SCHEDULED' | 'FINISHED' | 'FAILED' | 'KILLED', end_time?: number, run_name?: string): Promise<object>;
    /**
     * Log a metric for a run. A metric is a key-value pair (string key, float value) with an associated timestamp.
     * Examples include the various metrics that represent ML model accuracy. A metric can be logged multiple times.
     *
     * @param {string} run_id - ID of the run under which to log the metric. (required)
     * @param {string} key - Name of the metric. (required)
     * @param {number} value - Double value of the metric being logged. (required)
     * @param {number} timestamp - Unix timestamp in milliseconds at the time metric was logged. (required)
     * @param {number} step - Step at which to log the metric.
     * @returns {Promise<void>} A promise that resolves when the logging is complete.
     * @throws {ApiError} If the API request fails.
     */
    logMetric(run_id: string, key: string, value: number, timestamp?: number, step?: number): Promise<void>;
    /**
     * Log a batch of metrics, params, and tags for a run. If any data failed to be persisted, the server will
     * respond with an error (non-200 status code). In case of error (due to internal server error or an invalid
     * request), partial data may be written.
     *
     * @param {string} run_id - ID of the run to log under. (required)
     * @param {Array<{key: string; value: number; timestamp: number; step: number}>} [metrics]- Metrics to log.
     * A single request can contain up to 1000 metrics, and up to 1000 metrics, params, and tags in total.
     * @param {Array<{ key: string; value: string }>} [params] - Params to log. A single request can contain up
     * to 100 params, and up to 1000 metrics, params, and tags in total.
     * @param {Array<{ key: string; value: string }>} [tags] - Tags to log. A single request can contain up to
     * 100 tags, and up to 1000 metrics, params, and tags in total.
     * @returns {Promise<void>} A promise that resolves when the logging is complete.
     * @throws {ApiError} If the API request fails.
     */
    logBatch(run_id: string, metrics?: Array<{
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
    }>): Promise<void>;
    /**
     * Logs a model.
     *
     * @param {string} run_id - ID of the run to log under. (required)
     * @param {string} model_json - MLmodel file in json format. Should conform to the MLflow model format,
     * including fields like artifact_path, flavors, model_uuid, utc_time_created, and run_id. (required)
     * @returns {Promise<void>} A promise that resolves when the logging is complete.
     * @throws {ApiError} If the API request fails.
     */
    logModel(run_id: string, model_json: string): Promise<void>;
    /**
     * Logs inputs.
     *
     * @param {string} run_id - ID of the run to log under. (required)
     * @param {Array<Object>} [datasets] - Dataset inputs. Each object should have a 'dataset' property with 'name',
     * 'digest', 'source_type', and 'source' fields. Optional 'tags' array can be included for each dataset. (required)
     * @returns {Promise<void>} A promise that resolves when the logging is complete.
     * @throws {ApiError} If the API request fails.
     */
    logInputs(run_id: string, datasets: Array<{
        tags?: Array<{
            key: string;
            value: string;
        }>;
        dataset: {
            name: string;
            digest: string;
            source_type: string;
            source: string;
            schema?: string;
            profile?: string;
        };
    }>): Promise<void>;
    /**
     * Set a tag on a run. Tags are run metadata that can be updated during a run and after a run completes.
     *
     * @param {string} run_id - ID of the run under which to log the tag. (required)
     * @param {string} key - Name of the tag. Maximum size depends on storage backend. All storage backends are guaranteed
     * to support key values up to 250 bytes in size. (required)
     * @param {string} value - String value of the tag being logged. Maximum size depends on storage backend. All storage
     * backends are guaranteed to support key values up to 5000 bytes in size. (required)
     * @returns {Promise<void>} A promise that resolves when the logging is complete.
     * @throws {ApiError} If the API request fails.
     */
    setTag(run_id: string, key: string, value: string): Promise<void>;
    /**
     * Delete a tag on a run. Tags are run metadata that can be updated during a run and after a run completes.
     *
     * @param {string} run_id - ID of the run that the tag was logged under. (required)
     * @param {string} key - Name of the tag. Maximum size is 255 bytes. (required)
     * @returns {Promise<void>} A promise that resolves when the deletion is complete.
     * @throws {ApiError} If the API request fails.
     */
    deleteTag(run_id: string, key: string): Promise<void>;
    /**
     * Log a param used for a run. A param is a key-value pair (string key, string value). Examples include
     * hyperparameters used for ML model training and constant dates and values used in an ETL pipeline.
     * A param can be logged only once for a run.
     *
     * @param {string} run_id - ID of the run under which to log the param. (required))
     * @param {string} key - Name of the param. Maximum size is 255 bytes. (required)
     * @param {string} value  - String value of the param being logged. Maximum size is 6000 bytes. (required)
     * @returns {Promise<void>} A promise that resolves when the logging is complete.
     * @throws {ApiError} If the API request fails.
     */
    logParam(run_id: string, key: string, value: string): Promise<void>;
    /**
     * Get a list of all values for the specified metric for a given run.
     *
     * @param {string} run_id - ID of the run from which to fetch metric values. (required)
     * @param {string} metric_key - Name of the metric. (required)
     * @param {string} page_token - Token indicating the page of metric history to fetch.
     * @param {number} max_results - Maximum number of logged instances of a metric for a run to return per call.
     * Backend servers may restrict the value of max_results depending on performance requirements. Requests that
     * do not specify this value will behave as non-paginated queries where all metric history values for a given
     * metric within a run are returned in a single response.
     * @returns {Promise<MetricHistory>} A promise that resolves with the values for the specified metric.
     * @throws {ApiError} If the API request fails.
     */
    getMetricHistory(run_id: string, metric_key: string, page_token?: string, max_results?: number): Promise<object>;
    /**
     * Search for runs that satisfy expressions. Search expressions can use Metric and Param keys.
     *
     * @param {Array<string>} [experiment_ids] - List of experiment IDs to search over.
     * @param {string} filter - A filter expression over params, metrics, and tags, that allows returning a subset of runs.
     * The syntax is a subset of SQL that supports ANDing together binary operations between a param, metric, or
     * tag and a constant.
     * Example: metrics.rmse < 1 and params.model_class = 'LogisticRegression'
     * You can select columns with special characters (hyphen, space, period, etc.) by using double quotes:
     * metrics."model class" = 'LinearRegression' and tags."user-name" = 'Tomas'
     * Supported operators are =, !=, >, >=, <, and <=.
     * @param {string} run_view_type - Whether to display only active, only deleted, or all runs. Defaults to active runs.
     * @param {number} max_results - Maximum number of runs desired. If unspecified, defaults to 1000. All servers are
     * guaranteed to support a max_results theshold of at least 50,000 but may support more. Callers of this endpoint are
     * encouraged to pass max_results explicitly and leverage page_token to iterate through experiments.
     * @param {Array<string>} [order_by] - List of columns to be ordered by, including attributes, params, metrics, and tags with an optional
     * "DESC" or "ASC" annotation, where "ASC" is the default.
     * Example: ["params.input DESC","metrics.alpha ASC", "metrics.rmse"] Tiebreaks are done by start_time DESC followed by
     * run_id for runs with the same start time (and this is the default ordering criterion if order_by is not provided).
     * @param {string} page_token - Token that can be used to retrieve the next page of run results. A missing token indicates that
     * there are no additional run results to be fetched.
     * @returns {Promise<SearchedRuns>} A promise that resovles with the runs that match the search criteria.
     * @throws {ApiError} If the API request fails.
     */
    searchRuns(experiment_ids: Array<string>, filter: string, run_view_type?: 'ACTIVE_ONLY' | 'DELETED_ONLY' | 'ALL', max_results?: number, order_by?: Array<string>, page_token?: string): Promise<object>;
    /**
     * List artifacts for a run. Takes an optional artifact_path prefix which if specified, the response contains only
     * artifacts with the specified prefix.
     *
     * @param {string} run_id - ID of the run whose artifacts to list. (required)
     * @param {string} path - Filter artifacts matching this path (a relative path from the root artifact directory).
     * @param {string} page_token  - Token indicating the page of artifact results to fetch.
     * @returns {Promise<Artifacts>} A promise that resolves with a list artifacts for the specified run.
     * @throws {ApiError} If the API request fails.
     */
    listArtifacts(run_id: string, path?: string, page_token?: string): Promise<object>;
}
export default RunClient;
