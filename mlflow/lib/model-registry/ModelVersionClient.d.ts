declare class ModelVersionClient {
    private baseUrl;
    constructor(trackingUri: string);
    /**
     * Creates a new version of a model
     *
     * @param {string} modelName - the name of the registered model (required)
     * @param {string} source - the source path where the model artifacts are stored (required)
     * @param {string} run_id - the id of the run that generated this version (optional)
     * @param {string[]} tags - Tag of key/value pairs for the model version (optional)
     * @param {string} run_link - MLflow run link - the exact link of the run that generated this
     * model version (optional)
     * @param {string} description - Description of the model version (optional)
     * @returns {Promise<ModelVersion>} - the created model version object
     * @throws {ApiError} If the API request fails
     */
    createModelVersion(modelName: string, source: string, run_id?: string, tags?: Array<{
        key: string;
        value: string;
    }>, run_link?: string, description?: string): Promise<object>;
    /**
     * Gets the specified version of the model
     *
     * @param {string} modelName - the name of the registered model (Required)
     * @param {string} version - the version number of the model to fetch (Required)
     * @returns {Promise<ModelVersion>} - the created model version object
     * @throws {ApiError} If the API request fails
     */
    getModelVersion(modelName: string, version: string): Promise<object>;
    /**
     * Updates a specific model version.
     *
     * @param {string} modelName - the name of the registered model (Required)
     * @param {string} version - the version number of the model to update (Required)
     * @param {string} description - The description of the model version (Optional)
     * @returns {Promise<ModelVersion>} - the created model version object
     * @throws {ApiError} If the API request fails
     */
    updateModelVersion(modelName: string, version: string, description?: string): Promise<object>;
    /**
     * Searches for model versions based on provided filters.
     *
     * @param {string} filter - the filter criteria for searching model versions (Optional)
     * @param {number} maxResults - the maximum number of results to return (Optional)
     * @param {string[]} order_by - List of columns to be ordered by (Optional)
     * @param {string} page_token - Pagination token to go to next page based on previous search query (Optional)
     * @returns {Promise<ModelVersions>} - an array of model versions that match the search criteria
     * @throws {ApiError} If the API request fails
     */
    searchModelVersions(filter?: string, maxResults?: number, order_by?: Array<string>, page_token?: string): Promise<Array<object>>;
    /**
     * Retrieves the download uri for model version artifacts.
     *
     * @param {string} modelName - the name of the registered model (Required)
     * @param {string} version - the version number of the model to fetch the uri for (Required)
     * @returns {Promise<ArtifactUri>} - the uri for downloading the model version artifacts
     * @throws {ApiError} If the API request fails
     */
    getDownloadUriForModelVersionArtifacts(modelName: string, version: string): Promise<string>;
    /**
     * Transitions a model version to a different stage.
     *
     * @param {string} modelName - the name of the registered model (Required)
     * @param {string} version - the version number of the model to transition (Required)
     * @param {string} stage - the stage to transition the model version to (e.g., 'staging', 'production') (Required)
     * @param {boolean} archive_existing_versions - This flag dictates whether all existing model
     * versions in that stage should be atomically moved to the "archived" stage. This ensures
     * that at-most-one model version exists in the target stage. (Required)
     * @returns {Promise<ModelVersion>} - the updated model version object after the stage transition
     * @throws {ApiError} If the API request fails
     */
    transitionModelVersionStage(modelName: string, version: string, stage: string, archive_existing_versions: boolean): Promise<object>;
    /**
     * Sets a tag on a specific model version.
     *
     * @param {string} modelName - the name of the registered model (required)
     * @param {string} version - the version number of the model to tag (required)
     * @param {string} key - the key of the tag (required)
     * @param {string} value - the value of the tag (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    setModelVersionTag(modelName: string, version: string, key: string, value: string): Promise<void>;
    /**
     * Deletes a tag from a specific model version.
     *
     * @param {string} modelName - the name of the registered model (required)
     * @param {string} version - the version number of the model to untag (required)
     * @param {string} key - the key of the tag to delete (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    deleteModelVersionTag(modelName: string, version: string, key: string): Promise<void>;
    /**
     * Deletes a specific model version.
     *
     * @param {string} modelName - the name of the registered model (Required)
     * @param {string} version - the version number of the model to delete (Required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    deleteModelVersion(modelName: string, version: string): Promise<void>;
}
export default ModelVersionClient;
