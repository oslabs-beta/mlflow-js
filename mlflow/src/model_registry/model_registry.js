//model_registry.js

class ModelRegistry {
  constructor(trackingUri) {
    this.trackingUri = trackingUri;
  }

  /**
   * Creates a new registered model.
   *
   * @param {string} name - The name of the model to register (required)
   * @param {Array<{key: string, value: string}>} [tags=[]] - Optional tags for the model.
   * Must be formatted like: [{"key": "keyName", "value": "valueName"}]
   * @param {string} [description=''] - Optional description for the model
   * @returns {Promise<Object>} The created registered model object
   * @throws {Error} - If the API request fails
   */
  async createRegisteredModel(name, tags = [], description = '') {
    if (!name) {
      throw new Error('Model name is required');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/registered-models/create`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, tags, description }),
    });

    const data = await response.json();

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
   * Gets a registered model.
   *
   * @param {string} name - The name of the registered model to retrieve (required)
   * @returns {Promise<Object>} The registered model object
   */
  async getRegisteredModel(name) {
    if (!name) {
      throw new Error('Model name is required');
    }

    const url = `${
      this.trackingUri
    }/api/2.0/mlflow/registered-models/get?name=${encodeURIComponent(name)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error getting registered model: ${data.message || response.statusText}`
      );
    }

    return data.registered_model;
  }

  /**
   * Renames a registered model.
   * Note: As of MLflow 2.15.1 renaming a model may cause it to lose its tags.
   * If maintaining tags is crucial, consider re-applying them after renaming.
   *
   * @param {string} name - The current name of the registered model (required)
   * @param {string} newName - The new name for the registered model (required)
   * @returns {Promise<Object>} The updated registered model object
   */
  async renameRegisteredModel(name, newName) {
    if (!name || !newName) {
      throw new Error('Both current name and new name are required');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/registered-models/rename`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, new_name: newName }),
    });

    const data = await response.json();

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
   * Updates a registered model.
   *
   * @param {string} name - The name of the registered model to update (required)
   * @param {string} [description] - The new description for the model
   * @returns {Promise<Object>} The updated registered model object
   */
  async updateRegisteredModel(name, description) {
    if (!name) {
      throw new Error('Model name is required');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/registered-models/update`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    const data = await response.json();

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
   * @param {string} name - The name of the registered model to delete (required)
   * @returns {Promise<void>}
   */
  async deleteRegisteredModel(name) {
    if (!name) {
      throw new Error('Model name is required');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/registered-models/delete`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        `Error deleting registered model: ${
          data.message || response.statusText
        }`
      );
    }
  }

  /**
   * Gets the latest model versions for a registered model.
   *
   * @param {string} name - The name of the registered model (required)
   * @param {Array<string>} [stages=[]] - The stages to get the latest versions from
   * @returns {Promise<Array<Object>>} The latest model version objects
   */
  async getLatestModelVersions(name, stages = []) {
    if (!name) {
      throw new Error('Model name is required');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/registered-models/get-latest-versions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, stages }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error getting latest model versions: ${
          data.message || response.statusText
        }`
      );
    }
    return data.model_versions;
  }

  /**
   * Searches for registered models.
   *
   * @param {string} [filter] - String filter condition
   * @param {number} [maxResults] - Maximum number of models desired
   * @param {Array<string>} [orderBy] - List of columns for ordering search results
   * @param {string} [pageToken] - Token for pagination
   * @returns {Promise<Object>} Object containing matching models and next page token
   */
  async searchRegisteredModels(filter, maxResults, orderBy, pageToken) {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (maxResults) params.append('max_results', maxResults);
    if (orderBy) params.append('order_by', orderBy.join(','));
    if (pageToken) params.append('page_token', pageToken);

    const url = `${
      this.trackingUri
    }/api/2.0/mlflow/registered-models/search?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error searching registered models: ${
          data.message || response.statusText
        }`
      );
    }
    return {
      registeredModels: data.registered_models,
      nextPageToken: data.next_page_token,
    };
  }

  /**
   * Sets a tag on a registered model.
   *
   * @param {string} name - The name of the registered model (required)
   * @param {string} key - The tag key (required)
   * @param {string} value - The tag value (required)
   * @returns {Promise<void>}
   */
  async setRegisteredModelTag(name, key, value) {
    if (!name || !key || !value) {
      throw new Error('Model name, tag key, and tag value are required');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/registered-models/set-tag`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, key, value }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        `Error setting registered model tag: ${
          data.message || response.statusText
        }`
      );
    }
  }

  /**
   * Deletes a tag from a registered model.
   *
   * @param {string} name - The name of the registered model (required)
   * @param {string} key - The tag key to delete (required)
   * @returns {Promise<void>}
   */
  async deleteRegisteredModelTag(name, key) {
    if (!name || !key) {
      throw new Error('Model name and tag key are required');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/registered-models/delete-tag`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, key }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        `Error deleting registered model tag: ${
          data.message || response.statusText
        }`
      );
    }
  }

  /**
    * Sets an alias for a registered model version.
   \*
    * @param {string} name - The name of the registered model (required)
    * @param {string} alias - The alias to set (required)
    * @param {string} version - The version number to alias (required)
    * @returns {Promise<void>}
   */
  async setRegisteredModelAlias(name, alias, version) {
    if (!name) {
      throw new Error('name is required');
    } else if (!alias) {
      throw new Error('alias is required');
    } else if (!version) {
      throw new Error('version is required');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/registered-models/alias`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, alias, version }),
    });

    // data is an empty object
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error setting model alias: ${data.message || response.statusText}`
      );
    }
    return data;
  }

  /**
    * Deletes an alias for a registered model.
   \*
    * @param {string} name - The name of the registered model (required)
    * @param {string} alias - The alias to delete (required)
    * @returns {Promise<void>}
   */
  async deleteRegisteredModelAlias(name, alias) {
    if (!name) {
      throw new Error('name is required');
    } else if (!alias) {
      throw new Error('alias is required');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/registered-models/alias`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, alias }),
    });

    // data is an empty object
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error deleting model alias: ${response.statusText}`);
    }
    return data;
  }

  /**
    * Gets a model version by its alias.
   \*
    * @param {string} name - The name of the registered model (required)
    * @param {string} alias - The alias of the model version to retrieve (required)
    * @returns {Promise<Object>} The model version object
   */
  async getModelVersionByAlias(name, alias) {
    if (!name) {
      throw new Error('name is required');
    } else if (!alias) {
      throw new Error('alias is required');
    }
    const url = `${this.trackingUri}/api/2.0/mlflow/registered-models/alias`;
    const response = await fetch(`${url}?name=${name}&alias=${alias}`);

    /**
     * data has the field:
     * model_version
     */
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error getting model version by alias: ${
          data.message || response.statusText
        }`
      );
    }
    return data;
  }
}
export { ModelRegistry };