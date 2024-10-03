import { ApiError } from '../utils/apiError';
import { apiRequest } from '../utils/apiRequest';

class ModelVersionClient {
  private baseUrl: string;

  constructor(trackingUri: string) {
    this.baseUrl = trackingUri;
  }

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
      throw new ApiError(
        `Error creating model version: ${data.message || response.statusText}`,
        response.status
      );
    }

    // return the model version obj
    return data.model_version;
  }

  /**
   * Gets the specified version of the model
   * 
   * @param {string} modelName - the name of the registered model (Required)
   * @param {string} version - the version number of the model to fetch (Required)
   * @returns {Promise<ModelVersion>} - the created model version object
   * @throws {ApiError} If the API request fails
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
      throw new ApiError(
        `Error fetching model version: ${data.message || response.statusText}`,
        response.status
      );
    }

    // return the model version obj
    return data.model_version;
  }

  /**
   * Updates a specific model version.
   * 
   * @param {string} modelName - the name of the registered model (Required)
   * @param {string} version - the version number of the model to update (Required)
   * @param {string} description - The description of the model version (Optional)
   * @returns {Promise<ModelVersion>} - the created model version object
   * @throws {ApiError} If the API request fails
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
      throw new ApiError(
        `Error updating model version: ${data.message || response.statusText}`,
        response.status
      );
    }

    // return the updated model version obj
    return data.model_version;
  }

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
      throw new ApiError(
        `Error searching model versions: ${data.message || response.statusText}`,
        response.status
      );
    }

    // return an array of model versions that match the criteria
    return data.model_versions;
  }

  /**
   * Retrieves the download uri for model version artifacts.
   * 
   * @param {string} modelName - the name of the registered model (Required)
   * @param {string} version - the version number of the model to fetch the uri for (Required)
   * @returns {Promise<ArtifactUri>} - the uri for downloading the model version artifacts
   * @throws {ApiError} If the API request fails
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
      throw new ApiError(
        `Error fetching download uri: ${data.message || response.statusText}`,
        response.status
      );
    }

    // return the download uri as a string
    return data.artifact_uri;
  }

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
      throw new ApiError(
        `Error transitioning model version stage: ${
          data.message || response.statusText
        }`,
        response.status
      );
    }

    // return the updated model version obj
    return data.model_version;
  }

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
      throw new ApiError(
        `Error setting model version tag: ${
          data.message || response.statusText
        }`,
        response.status
      );
    }

    // return nothing, just resolve
    return;
  }

  /**
   * Deletes a tag from a specific model version.
   *
   * @param {string} modelName - the name of the registered model (required)
   * @param {string} version - the version number of the model to untag (required)
   * @param {string} key - the key of the tag to delete (required)
   * @returns {Promise<void>}
   * @throws {ApiError} If the API request fails
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
      throw new ApiError(
        `Error deleting model version tag: ${
          data.message || response.statusText
        }`,
        response.status
      );
    }

    // return nothing, just resolve
    return;
  }

  /**
   * Deletes a specific model version.
   * 
   * @param {string} modelName - the name of the registered model (Required)
   * @param {string} version - the version number of the model to delete (Required)
   * @returns {Promise<void>}
   * @throws {ApiError} If the API request fails
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
      throw new ApiError(
        `Error deleting model version: ${data.message || response.statusText}`,
        response.status
      );
    }

    // return nothing, just resolve
    return;
  }
}

export default ModelVersionClient;
