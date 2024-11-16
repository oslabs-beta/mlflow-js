declare class ModelManager {
    private modelRegistry;
    private modelVersion;
    private runClient;
    constructor(trackingUri: string);
    /**
     * Creates a new registered model and creates the first version of that model.
     *
     * @param {string} name - Name of the registered model. (Required)
     * @param {string} versionSource - URI indicating the location of the model artifacts. (Required)
     * @param {string} versionRun_id - MLflow run ID for correlation, if versionSource was generated
     * by an experiment run in MLflow tracking server.
     * @returns {Promise<Object>} - the updated model version object
     * @throws {ApiError | Error} If request fails
     */
    createRegisteredModelWithVersion(name: string, versionSource: string, versionRun_id: string): Promise<object>;
    /**
     * Updates a registered model's description and tag.
     *
     * @param {string} name - Name of the registered model. (Required)
     * @param {string} tagKey - Name of the tag. (Required)
     * @param {string} tagValue - String value of the tag being logged. (Required)
     * @param {string} description - Description of the registered model.
     * @returns {Promise<Registered Model>} - the updated registered model object
     * @throws {ApiError | Error} If request fails
     */
    updateRegisteredModelDescriptionAndTag(name: string, tagKey: string, tagValue: string, description: string): Promise<object>;
    /**
     * Updates the latest version of the specified registered model's description.
     * And adds a new alias, and tag key/value for that latest version.
     *
     * @param {string} name - Name of the registered model. (Required)
     * @param {string} alias - Name of the alias. (Required)
     * @param {string} description - The description for the model version. (Required)
     * @param {string} key - Name of the tag. (Required)
     * @param {string} value - Name of the value of the tag being logged. (Required)
     * @returns {Promise<Model Version>} - the updated model version object
     * @throws {ApiError | Error} If request fails
     */
    updateAllLatestModelVersion(name: string, alias: string, description: string, key: string, value: string): Promise<object>;
    /**
     * Adds a new tag key/value for the latest version of the specified registered model.
     *
     * @param {string} name - Name of the registered model. (Required)
     * @param {string} key - Name of the tag. (Required)
     * @param {string} value - Name of the value of the tag being logged. (Required)
     * @returns {Promise<void>} - a promise that resolves when the model version is deleted
     * @throws {ApiError | Error} If request fails
     */
    setLatestModelVersionTag(name: string, key: string, value: string): Promise<void>;
    /**
     * Adds an alias for the latest version of the specified registered model.
     *
     * @param {string} name - Name of the registered model. (Required)
     * @param {string} alias - Name of the alias. (Required)
     * @returns {Promise<void>} - a promise that resolves when the model version is deleted
     * @throws {ApiError | Error} If request fails
     */
    setLatestModelVersionAlias(name: string, alias: string): Promise<void>;
    /**
     * Updates the description of the latest version of a registered model.
     *
     * @param {string} name - Name of the registered model. (Required)
     * @param {string} description - The description for the model version. (Required)
     * @returns {Promise<Model Version>} - the updated model version object
     * @throws {ApiError | Error} If request fails
     */
    updateLatestModelVersion(name: string, description: string): Promise<object>;
    /**
     * Updates the specified version of the specified registered model's description.
     * And adds a new alias, and tag key/value for that specified version.
     *
     * @param {string} name - Name of the registered model. (Required)
     * @param {string} version - Model version number. (Required)
     * @param {string} alias - Name of the alias. (Required)
     * @param {string} key key - Name of the tag. (Required)
     * @param {string} value - Name of the value of the tag being logged. (Required)
     * @param {string} description - The description for the model version. (Required)
     * @returns {Promise<Model Version>} - the updated model version object
     * @throws {ApiError | Error} If request fails
     */
    updateAllModelVersion(name: string, version: string, alias: string, key: string, value: string, description: string): Promise<object>;
    /**
     * Deletes the latest version of the specified registered model.
     *
     * @param {string} name - the model name
     * @returns - a promise that resolves when the model version is deleted
     * @throws {ApiError | Error} If request fails
     */
    deleteLatestModelVersion(name: string): Promise<void>;
    /**
     * Looks through the runs with the given experiment id and through their metrics
     * looking for the specified metric that has the highest or lowest value (can be specified).
     * Then it creates a new model with the specified model name and creates a version of that
     * model from the run with the best metric.
     *
     * @param {string[]} experiment_ids - An array containing an experiment id. (Required)
     * @param {string} filterMetric - The name of the metric that we're filtering by. (Required)
     * @param {string} metricMinOrMax - A string specifying if we want the minimum or maximum
     *                                  value of the specified metric. Can be either 'min' or
     *                                  'max'(Required)
     * @param {string} modelName - The name of the new model that will be created. (Required)
     * @returns {Promise<void>}
     * @throws {ApiError | Error} If request fails
     */
    createModelFromRunWithBestMetric(experiment_ids: string[], filterMetric: string, metricMinOrMax: string, modelName: string): Promise<void>;
}
export default ModelManager;
