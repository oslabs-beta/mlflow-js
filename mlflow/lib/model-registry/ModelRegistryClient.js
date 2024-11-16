import { ApiError } from '../utils/apiError.js';
import { apiRequest } from '../utils/apiRequest.js';
class ModelRegistryClient {
    constructor(trackingUri) {
        this.baseUrl = trackingUri;
    }
    /**
     * Creates a new registered model.
     *
     * @param {string} name - The name of the model to register (required)
     * @param {Array<{key: string, value: string}>} [tags] - Optional tags for the model
     * @param {string} [description] - Optional description for the model
     * @returns {Promise<RegisteredModel>} The created registered model object
     * @throws {ApiError} If the API request fails
     */
    async createRegisteredModel(name, tags, description) {
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/create', {
            method: 'POST',
            body: { name, tags, description },
        });
        if (!response.ok) {
            throw new ApiError(`Error creating registered model: ${data.message || response.statusText}`, response.status);
        }
        return data.registered_model;
    }
    /**
     * Retrieves a registered model by name.
     *
     * @param {string} name - The name of the registered model to retrieve (required)
     * @returns {Promise<RegisteredModel>} The registered model object
     * @throws {ApiError} If the API request fails
     */
    async getRegisteredModel(name) {
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/get', {
            method: 'GET',
            params: { name },
        });
        if (!response.ok) {
            throw new ApiError(`Error getting registered model: ${data.message || response.statusText}`, response.status);
        }
        return data.registered_model;
    }
    /**
     * Renames a registered model.
     *
     * @param {string} name - The current name of the registered model (required)
     * @param {string} newName - The new name for the registered model (required)
     * @returns {Promise<RegisteredModel>} The updated registered model object
     * @throws {ApiError} If the API request fails
     */
    async renameRegisteredModel(name, newName) {
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/rename', {
            method: 'POST',
            body: { name, new_name: newName },
        });
        if (!response.ok) {
            throw new ApiError(`Error renaming registered model: ${data.message || response.statusText}`, response.status);
        }
        return data.registered_model;
    }
    /**
     * Updates a registered model's description.
     *
     * @param {string} name - The name of the registered model to update (required)
     * @param {string} [description] - The new description for the model
     * @returns {Promise<RegisteredModel>} The updated registered model object
     * @throws {ApiError} If the API request fails
     */
    async updateRegisteredModel(name, description) {
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/update', {
            method: 'PATCH',
            body: { name, description },
        });
        if (!response.ok) {
            throw new ApiError(`Error updating registered model: ${data.message || response.statusText}`, response.status);
        }
        return data.registered_model;
    }
    /**
     * Deletes a registered model.
     *
     * @param {string} name - The name of the registered model to delete (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    async deleteRegisteredModel(name) {
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/delete', {
            method: 'DELETE',
            body: { name },
        });
        if (!response.ok) {
            throw new ApiError(`Error deleting registered model: ${data.message || response.statusText}`, response.status);
        }
        return;
    }
    /**
     * Gets the latest versions of a registered model.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string[]} [stages] - Optional array of stages to filter the versions by
     * @returns {Promise<ModelVersion[]>} An array of the latest model versions
     * @throws {ApiError} If the API request fails
     */
    async getLatestModelVersions(name, stages) {
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/get-latest-versions', {
            method: 'POST',
            body: { name, stages },
        });
        if (!response.ok) {
            throw new ApiError(`Error getting latest versions: ${data.message || response.statusText}`, response.status);
        }
        return data.model_versions;
    }
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
    async searchRegisteredModels(filter, maxResults, orderBy, pageToken) {
        const params = {};
        if (filter)
            params.filter = filter;
        if (maxResults)
            params.max_results = maxResults.toString();
        if (orderBy)
            params.order_by = orderBy.join(',');
        if (pageToken)
            params.page_token = pageToken;
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/search', {
            method: 'GET',
            params,
        });
        if (!response.ok) {
            throw new ApiError(`Error searching registered models: ${data.message || response.statusText}`, response.status);
        }
        return data;
    }
    /**
     * Sets a tag on a registered model.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string} key - The key of the tag (required)
     * @param {string} value - The value of the tag (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    async setRegisteredModelTag(name, key, value) {
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/set-tag', {
            method: 'POST',
            body: { name, key, value },
        });
        if (!response.ok) {
            throw new ApiError(`Error setting registered model tag: ${data.message || response.statusText}`, response.status);
        }
        return;
    }
    /**
     * Deletes a tag from a registered model.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string} key - The key of the tag to delete (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    async deleteRegisteredModelTag(name, key) {
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/delete-tag', {
            method: 'DELETE',
            body: { name, key },
        });
        if (!response.ok) {
            throw new ApiError(`Error deleting registered model tag: ${data.message || response.statusText}`, response.status);
        }
        return;
    }
    /**
     * Sets an alias for a specific version of a registered model.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string} alias - The alias to set (required)
     * @param {string} version - The version number to associate with the alias (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    async setRegisteredModelAlias(name, alias, version) {
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/alias', {
            method: 'POST',
            body: { name, alias, version },
        });
        if (!response.ok) {
            throw new ApiError(`Error setting registered model alias: ${data.message || response.statusText}`, response.status);
        }
        return;
    }
    /**
     * Deletes an alias from a registered model.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string} alias - The alias to delete (required)
     * @returns {Promise<void>}
     * @throws {ApiError} If the API request fails
     */
    async deleteRegisteredModelAlias(name, alias) {
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/alias', {
            method: 'DELETE',
            body: { name, alias },
        });
        if (!response.ok) {
            throw new ApiError(`Error deleting registered model alias: ${data.message || response.statusText}`, response.status);
        }
        return;
    }
    /**
     * Retrieves a model version using its alias.
     *
     * @param {string} name - The name of the registered model (required)
     * @param {string} alias - The alias of the model version to retrieve (required)
     * @returns {Promise<ModelVersion>} The model version object
     * @throws {ApiError} If the API request fails
     */
    async getModelVersionByAlias(name, alias) {
        const { response, data } = await apiRequest(this.baseUrl, 'registered-models/alias', {
            method: 'GET',
            params: { name, alias },
        });
        if (!response.ok) {
            throw new ApiError(`Error getting model version by alias: ${data.message || response.statusText}`, response.status);
        }
        return data.model_version;
    }
}
export default ModelRegistryClient;
//# sourceMappingURL=ModelRegistryClient.js.map