import apiRequest from 'utils/ApiRequest';

class ModelVersionClient {
  private baseUrl: string;

  constructor(trackingUri: string) {
    this.baseUrl = trackingUri;
  }

  /**
   * Description - Creates a new version of a model
   * @param modelName - the name of the registered model (required)
   * @param source - the source path where the model artifacts are stored (required)
   * @param run_id - the id of the run that generated this version (optional)
   * @param tags - Tag of key/value pairs for the model version (optional)
   * @param run_link - MLflow run link - the exact link of the run that generated this
   * model version (optional)
   * @param description - Description of the model version (optional)
   * @returns - the created model version object
   */
  async createModelVersion(
    modelName: string,
    source: string,
    run_id?: string,
    tags?: Array<{ key: string; value: string }>,
    run_link?: string,
    description?: string
  ): Promise<object> {
    // fire off a post request to create the model versions
    const { response, data } = await apiRequest(
      this.baseUrl,
      'model-versions/create',
      {
        method: 'POST',
        body: { name: modelName, source, run_id, tags, run_link, description },
      }
    );

    // is response ok? else throw error
    if (!response.ok) {
      throw new Error(
        `Error creating model version: ${data.message || response.statusText}`
      );
    }

    // return the model version obj
    return data.model_version;
  }

  /**
   * Description - Gets the specified version of the model
   * @param modelName - the name of the registered model (Required)
   * @param version - the version number of the model to fetch (Required)
   * @returns - the fetched model version object
   */
  async getModelVersion(modelName: string, version: string): Promise<object> {
    // fire off a get request to fetch the model version
    const { response, data } = await apiRequest(
      this.baseUrl,
      'model-versions/get',
      {
        method: 'GET',
        params: { name: modelName, version },
      }
    );

    // is response ok? else throw error
    if (!response.ok) {
      throw new Error(
        `Error fetching model version: ${data.message || response.statusText}`
      );
    }

    // return the model version obj
    return data.model_version;
  }

  /**
   * Description - updates a specific model version.
   * @param {string} modelName - the name of the registered model (Required)
   * @param {string} version - the version number of the model to update (Required)
   * @param {string} description - The description of the model version (Optional)
   * @returns {Promise<Object>} - the updated model version object
   */
  async updateModelVersion(
    modelName: string,
    version: string,
    description?: string
  ): Promise<object> {
    // fire off a patch request to update the model version
    const { response, data } = await apiRequest(
      this.baseUrl,
      'model-versions/update',
      {
        method: 'PATCH',
        body: { name: modelName, version, description },
      }
    );

    // is response ok? else throw error
    if (!response.ok) {
      throw new Error(
        `Error updating model version: ${data.message || response.statusText}`
      );
    }

    // return the updated model version obj
    return data.model_version;
  }

  /**
   * Description - deletes a specific model version.
   * @param modelName - the name of the registered model (Required)
   * @param version - the version number of the model to delete (Required)
   * @returns - an empty promise object that resolves when the model version is deleted
   */
  async deleteModelVersion(modelName: string, version: string): Promise<void> {
    // fire off a delete request to remove the model version
    const { response, data } = await apiRequest(
      this.baseUrl,
      'model-versions/delete',
      {
        method: 'DELETE',
        body: { name: modelName, version },
      }
    );

    // is response ok? else throw error
    if (!response.ok) {
      throw new Error(
        `Error deleting model version: ${data.message || response.statusText}`
      );
    }

    // return nothing, just resolve
    return;
  }

  /**
   * Description - searches for model versions based on provided filters.
   * @param  filter - the filter criteria for searching model versions (Optional)
   * @param  maxResults - the maximum number of results to return (Optional)
   * @param order_by - List of columns to be ordered by (Optional)
   * @param page_token - Pagination token to go to next page based on previous search query (Optional)
   * @returns - an array of model versions that match the search criteria
   */
  async searchModelVersions(
    filter?: string,
    maxResults?: number,
    order_by?: Array<string>,
    page_token?: string
  ): Promise<Array<object>> {
    // let filter2: string = filter?.toString();
    const body: { [key: string]: any } = {};
    if (filter) {
      body.filter = filter;
    }
    if (maxResults) {
      body.maxResults = maxResults;
    }
    if (order_by) {
      body.order_by = order_by;
    }
    if (page_token) {
      body.page_token = page_token;
    }

    // fire off a get request to search for model versions
    const { response, data } = await apiRequest(
      this.baseUrl,
      'model-versions/search',
      {
        method: 'GET',
        params: body,
      }
    );

    // is response ok? else throw error
    if (!response.ok) {
      throw new Error(
        `Error searching model versions: ${data.message || response.statusText}`
      );
    }

    // return an array of model versions that match the criteria
    return data.model_versions;
  }

  /**
   * Description - retrieves the download uri for model version artifacts.
   * @param - the name of the registered model (Required)
   * @param - the version number of the model to fetch the uri for (Required)
   * @returns - the uri for downloading the model version artifacts
   */
  async getDownloadUriForModelVersionArtifacts(
    modelName: string,
    version: string
  ): Promise<string> {
    // fire off a get request to fetch the download uri
    const { response, data } = await apiRequest(
      this.baseUrl,
      'model-versions/get-download-uri',
      {
        method: 'GET',
        params: { name: modelName, version },
      }
    );

    // is response ok? else throw error
    if (!response.ok) {
      throw new Error(
        `Error fetching download uri: ${data.message || response.statusText}`
      );
    }

    // return the download uri as a string
    return data.artifact_uri;
  }

  /**
   * transitions a model version to a different stage.
   *
   * @param modelName - the name of the registered model (Required)
   * @param version - the version number of the model to transition (Required)
   * @param stage - the stage to transition the model version to (e.g., 'staging', 'production') (Required)
   * @param archive_existing_versions - This flag dictates whether all existing model
   * versions in that stage should be atomically moved to the "archived" stage. This ensures
   * that at-most-one model version exists in the target stage. (Required)
   * @returns - the updated model version object after the stage transition
   */
  async transitionModelVersionStage(
    modelName: string,
    version: string,
    stage: string,
    archive_existing_versions: boolean
  ): Promise<object> {
    // fire off a post request to transition the model version stage
    const { response, data } = await apiRequest(
      this.baseUrl,
      'model-versions/transition-stage',
      {
        method: 'POST',
        body: { name: modelName, version, stage, archive_existing_versions },
      }
    );

    // is response ok? else throw error
    if (!response.ok) {
      throw new Error(
        `Error transitioning model version stage: ${
          data.message || response.statusText
        }`
      );
    }

    // return the updated model version obj
    return data.model_version;
  }

  /**
   * sets a tag on a specific model version.
   *
   * @param modelName - the name of the registered model (required)
   * @param version - the version number of the model to tag (required)
   * @param key - the key of the tag (required)
   * @param value - the value of the tag (required)
   * @returns - a promise that resolves when the tag is set
   */
  async setModelVersionTag(
    modelName: string,
    version: string,
    key: string,
    value: string
  ): Promise<void> {
    // fire off a post request to set the tag on the model version
    const { response, data } = await apiRequest(
      this.baseUrl,
      'model-versions/set-tag',
      {
        method: 'POST',
        body: { name: modelName, version, key, value },
      }
    );

    // is response ok? else throw error
    if (!response.ok) {
      throw new Error(
        `Error setting model version tag: ${
          data.message || response.statusText
        }`
      );
    }

    // return nothing, just resolve
    return;
  }

  /**
   * deletes a tag from a specific model version.
   *
   * @param modelName - the name of the registered model (required)
   * @param version - the version number of the model to untag (required)
   * @param key - the key of the tag to delete (required)
   * @returns - a promise that resolves when the tag is deleted
   */
  async deleteModelVersionTag(
    modelName: string,
    version: string,
    key: string
  ): Promise<void> {
    // fire off a delete request to remove the tag from the model version
    const { response, data } = await apiRequest(
      this.baseUrl,
      'model-versions/delete-tag',
      {
        method: 'DELETE',
        body: { name: modelName, version, key },
      }
    );

    // is response ok? else throw error
    if (!response.ok) {
      throw new Error(
        `Error deleting model version tag: ${
          data.message || response.statusText
        }`
      );
    }

    // return nothing, just resolve
    return;
  }
}

export default ModelVersionClient;
