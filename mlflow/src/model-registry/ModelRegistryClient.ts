import apiRequest from '../utils/ApiRequest';

class ModelRegistryClient {
  private baseUrl: string;

  constructor(trackingUri: string) {
    this.baseUrl = trackingUri;
  }

  /**
   * Creates a new registered model.
   *
   * @param name - The name of the model to register (required)
   * @param tags - Optional tags for the model
   * @param description - Optional description for the model
   * @returns The created registered model object
   * @throws Error if the API request fails
   */
  async createRegisteredModel(
    name: string,
    tags?: Array<{ key: string; value: string }>,
    description?: string
  ): Promise<any> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/create',
      {
        method: 'POST',
        body: { name, tags, description },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error creating registered model: ${
          data.message || response.statusText
        }`
      );
    }

    return data.registered_model;
  }

  /**
   * Retrieves a registered model by name.
   *
   * @param name - The name of the registered model to retrieve (required)
   * @returns The registered model object
   * @throws Error if the API request fails
   */
  async getRegisteredModel(name: string): Promise<any> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/get',
      {
        method: 'GET',
        params: { name },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error getting registered model: ${data.message || response.statusText}`
      );
    }
    return data.registered_model;
  }

  /**
   * Renames a registered model.
   *
   * @param name - The current name of the registered model (required)
   * @param newName - The new name for the registered model (required)
   * @returns The updated registered model object
   * @throws Error if the API request fails
   */
  async renameRegisteredModel(name: string, newName: string): Promise<any> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/rename',
      {
        method: 'POST',
        body: { name, new_name: newName },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error renaming registered model: ${
          data.message || response.statusText
        }`
      );
    }
    return data.registered_model;
  }

  /**
   * Updates a registered model's description.
   *
   * @param name - The name of the registered model to update (required)
   * @param description - The new description for the model
   * @returns The updated registered model object
   * @throws Error if the API request fails
   */
  async updateRegisteredModel(
    name: string,
    description?: string
  ): Promise<any> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/update',
      {
        method: 'PATCH',
        body: { name, description },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error updating registered model: ${
          data.message || response.statusText
        }`
      );
    }

    return data.registered_model;
  }

  /**
   * Deletes a registered model.
   *
   * @param name - The name of the registered model to delete (required)
   * @throws Error if the API request fails
   */
  async deleteRegisteredModel(name: string): Promise<void> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/delete',
      {
        method: 'DELETE',
        body: { name },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error deleting registered model: ${
          data.message || response.statusText
        }`
      );
    }

    return;
  }

  /**
   * Gets the latest versions of a registered model.
   *
   * @param name - The name of the registered model (required)
   * @param stages - Array of stages to filter the versions by
   * @returns An array of the latest model versions
   * @throws Error if the API request fails
   */
  async getLatestModelVersions(name: string, stages?: string[]): Promise<any> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/get-latest-versions',
      {
        method: 'POST',
        body: { name, stages },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error getting latest versions: ${data.message || response.statusText}`
      );
    }

    return data.model_versions;
  }

  /**
   * Searches for registered models based on filter criteria.
   *
   * @param filter - Filter string to apply to the search
   * @param maxResults - Maximum number of results to return
   * @param orderBy - Array of fields to order the results by
   * @param pageToken - Token for pagination
   * @returns An object containing the search results and pagination information
   * @throws Error if the API request fails
   */
  async searchRegisteredModels(
    filter?: string,
    maxResults?: number,
    orderBy?: string[],
    pageToken?: string
  ): Promise<any> {
    const params: Record<string, string> = {};
    if (filter) params.filter = filter;
    if (maxResults) params.max_results = maxResults.toString();
    if (orderBy) params.order_by = orderBy.join(',');
    if (pageToken) params.page_token = pageToken;

    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/search',
      {
        method: 'GET',
        params,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error searching registered models: ${
          data.message || response.statusText
        }`
      );
    }

    return data;
  }

  /**
   * Sets a tag on a registered model.
   *
   * @param name - The name of the registered model (required)
   * @param key - The key of the tag (required)
   * @param value - The value of the tag (required)
   * @throws Error if the API request fails
   */
  async setRegisteredModelTag(
    name: string,
    key: string,
    value: string
  ): Promise<void> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/set-tag',
      {
        method: 'POST',
        body: { name, key, value },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error setting registered model tag: ${
          data.message || response.statusText
        }`
      );
    }

    return;
  }

  /**
   * Deletes a tag from a registered model.
   *
   * @param name - The name of the registered model (required)
   * @param key - The key of the tag to delete (required)
   * @throws Error if the API request fails
   */
  async deleteRegisteredModelTag(name: string, key: string): Promise<void> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/delete-tag',
      {
        method: 'DELETE',
        body: { name, key },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error deleting registered model tag: ${
          data.message || response.statusText
        }`
      );
    }

    return;
  }

  /**
   * Sets an alias for a specific version of a registered model.
   *
   * @param name - The name of the registered model (required)
   * @param alias - The alias to set (required)
   * @param version - The version number to associate with the alias (required)
   * @throws Error if the API request fails
   */
  async setRegisteredModelAlias(
    name: string,
    alias: string,
    version: string
  ): Promise<void> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/alias',
      {
        method: 'POST',
        body: { name, alias, version },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error setting registered model alias: ${
          data.message || response.statusText
        }`
      );
    }

    return;
  }

  /**
   * Deletes an alias from a registered model.
   *
   * @param name - The name of the registered model (required)
   * @param alias - The alias to delete (required)
   * @throws Error if the API request fails
   */
  async deleteRegisteredModelAlias(name: string, alias: string): Promise<void> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/alias',
      {
        method: 'DELETE',
        body: { name, alias },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error deleting registered model alias: ${
          data.message || response.statusText
        }`
      );
    }

    return;
  }

  /**
   * Retrieves a model version using its alias.
   *
   * @param name - The name of the registered model (required)
   * @param alias - The alias of the model version to retrieve (required)
   * @returns The model version object
   * @throws Error if the API request fails
   */
  async getModelVersionByAlias(name: string, alias: string): Promise<any> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/alias',
      {
        method: 'GET',
        params: { name, alias },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error getting model version by alias: ${
          data.message || response.statusText
        }`
      );
    }

    return data.model_version;
  }
}

export default ModelRegistryClient;