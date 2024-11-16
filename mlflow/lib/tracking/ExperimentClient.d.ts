declare class ExperimentClient {
    trackingUri: string;
    constructor(trackingUri: string);
    /**
     * Create an experiment with a name. Returns the ID of the newly created experiment.
     * Validates that another experiment with the same name does not already exist and fails if another experiment with the same name already exists.
     *
     * @param {string} name Experiment name.  (required)
     * @param {string} artifact_location Optional location where all artifacts for the experiment are stored.  If not provided, the remote server will select an appropriate default.
     * @param {Array<{key: string, value: string}>} tags Optional collection of tags to set on the experiment.
     * @returns {Promise<string>} Returns the ID of the newly created experiment in an object.
     * @throws {ApiError} If the API request fails
     */
    createExperiment(name: string, artifact_location?: string, tags?: Array<{
        key: string;
        value: string;
    }>): Promise<string>;
    /**
     * Search experiments.
     *
     * @param {string} filter A filter expression over experiment attributes and tags that allows returning a subset of experiments.  The syntax is a subset of SQL.  (required)
     * @param {number} max_results Maximum number of experiments desired.  (required)
     * @param {string} page_token Optional token indicating the page of experiments to fetch.
     * @param {string[]} order_by Optional list of columns for ordering search results.
     * @param {string} view_type Optional qualifier for type of experiments to be returned.  See https://mlflow.org/docs/latest/rest-api.html#mlflowviewtype
     * @returns {Promise<Object>} Returns object containing an array of experiment objects matching the filter,
     *    and optionally a next_page_token that can be used to retrieve the next page of experiments.
     * @throws {ApiError} If the API request fails
     */
    searchExperiment(filter: string, max_results: number, page_token?: string, order_by?: string[], view_type?: string): Promise<object>;
    /**
     * Get metadata for an experiment, querying by experiment ID. This method works on deleted experiments.
     *
     * @param {string} experiment_id ID of the associated experiment.  (required)
     * @returns {Promise<Object>} Returns object containing the matched experiment.
     * @throws {ApiError} If the API request fails
     */
    getExperiment(experiment_id: string): Promise<object>;
    /**
     * Get metadata for an experiment, querying by experiment name.
     * This endpoint will return deleted experiments,
     * but prefers the active experiment if an active and deleted experiment share the same name.
     * If multiple deleted experiments share the same name, the API will return one of them.
     *
     * @param {string} experiment_name ID of the associated experiment.  (required)
     * @returns {Promise<Object>} Returns object containing the matched experiment.
     * @throws {ApiError} If the API request fails
     */
    getExperimentByName(experiment_name: string): Promise<object>;
    /**
     * Mark an experiment for deletion.
     *
     * @param {string} experiment_id ID of the associated experiment.  (required)
     * @returns {void}
     * @throws {ApiError} If the API request fails
     */
    deleteExperiment(experiment_id: string): Promise<void>;
    /**
     * Restore an experiment marked for deletion.
     *
     * @param {string} experiment_id ID of the associated experiment.  (required)
     * @returns {void}
     * @throws {ApiError} If the API request fails
     */
    restoreExperiment(experiment_id: string): Promise<void>;
    /**
     * Update experiment name.
     *
     * @param {string} experiment_id ID of the associated experiment. (required)
     * @param {string} new_name The experiment’s name is changed to the new name. The new name must be unique. (required)
     * @returns {void}
     * @throws {ApiError} If the API request fails
     */
    updateExperiment(experiment_id: string, new_name: string): Promise<void>;
    /**
     * Set a tag on an experiment.
     *
     * @param {string} experiment_id ID of the experiment under which to log the tag. (required)
     * @param {string} key Name of the tag.  (required)
     * @param {string} value String value of the tag being logged.  (required)
     * @returns {void}
     * @throws {ApiError} If the API request fails
     */
    setExperimentTag(experiment_id: string, key: string, value: string): Promise<void>;
}
export default ExperimentClient;
