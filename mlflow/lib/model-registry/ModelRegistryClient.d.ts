declare class ModelRegistryClient {
    private baseUrl;
    constructor(trackingUri: string);
    /**
     * Creates a new registered model.
     *
     * @param {string} name - The name of the model to register (required)
     * @param {Array<{key: string, value: string}>} [tags] - Optional tags for the model
     * @param {string} [description] - Optional description for the model
     * @returns {Promise<RegisteredModel>} The created registered model object
     * @throws {ApiError} If the API request fails
     */
    createRegisteredModel(name: string, tags?: Array<{
        key: string;
        value: string;
    }>, description?: string): Promise<object>;
    /**
     * Retrieves a registered model by name.
     *
     * @param {string} name - The name of the registered model to retrieve (required)
     * @returns {Promise<RegisteredModel>} The registered model object
     * @throws {ApiError} If the API request fails
     */
    getRegisteredModel(name: string): Promise<object>;
    /**
     * Renames a registered model.
     *
     * @param {string} name - The current name of the registered model (required)
     * @param {string} newName - The new name for the registered model (required)
     * @returns {Promise<RegisteredModel>} The updated registered model object
     * @throws {ApiError} If the API request fails
     */
    renameRegisteredModel(name: string, newName: string): Promise<object>;
    /**
     * Updates a registered model's description.
     *
     * @param {string} name - The name of the registered model to update (required)
     * @param {string} [description] - The new description for the model
     * @returns {Promise<RegisteredModel>} The updated registered model object
     * @throws {ApiError} If the API request fails
     */
    updateRegisteredModel(name: string, description?: string): Promise<object>;
    /**
     * Deletes a registered model.
     *
     * @param {string} name - The name of the registered model to delete (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    deleteRegisteredModel(name: string): Promise<void>;
    /**
     * Gets the latest versions of a registered model.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string[]} [stages] - Optional array of stages to filter the versions by
     * @returns {Promise<ModelVersion[]>} An array of the latest model versions
     * @throws {ApiError} If the API request fails
     */
    getLatestModelVersions(name: string, stages?: string[]): Promise<Array<object>>;
    /**
     * Searches for registered models based on filter criteria.
     *
     * @param {string} [filter] - Optional filter string to apply to the search
     * @param {number} [maxResults] - Optional maximum number of results to return
     * @param {string[]} [orderBy] - Optional array of fields to order the results by
     * @param {string} [pageToken] - Optional token for pagination
     * @returns {Promise<{registered_models: RegisteredModel[], next_page_token: string}>} An object containing the search results and pagination information
     * @throws {ApiError} If the API request fails
     */
    searchRegisteredModels(filter?: string, maxResults?: number, orderBy?: string[], pageToken?: string): Promise<object>;
    /**
     * Sets a tag on a registered model.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string} key - The key of the tag (required)
     * @param {string} value - The value of the tag (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    setRegisteredModelTag(name: string, key: string, value: string): Promise<void>;
    /**
     * Deletes a tag from a registered model.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string} key - The key of the tag to delete (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    deleteRegisteredModelTag(name: string, key: string): Promise<void>;
    /**
     * Sets an alias for a specific version of a registered model.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string} alias - The alias to set (required)
     * @param {string} version - The version number to associate with the alias (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    setRegisteredModelAlias(name: string, alias: string, version: string): Promise<void>;
    /**
     * Deletes an alias from a registered model.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string} alias - The alias to delete (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    deleteRegisteredModelAlias(name: string, alias: string): Promise<void>;
    /**
     * Retrieves a model version using its alias.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string} alias - The alias of the model version to retrieve (required)
     * @returns {Promise<ModelVersion>} The model version object
     * @throws {ApiError} If the API request fails
     */
    getModelVersionByAlias(name: string, alias: string): Promise<object>;
}
export default ModelRegistryClient;
