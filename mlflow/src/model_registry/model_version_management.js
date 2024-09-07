const trackingUri = "http://localhost:5001"; // MLflow server port
class ModelVersionManagement {
    constructor(trackingUri) {
      this.trackingUri = trackingUri;
      console.log(`trackingUri: ${this.trackingUri}`);
    }
  
    /**
     * creates a new version of a registered model
     *
     * @param {string} modelName - the name of the registered model (required)
     * @param {string} source - the source path where the model artifacts are stored (required)
     * @param {string} [runId=null] - the id of the run that generated this version (optional)
     * @returns {Promise<Object>} - the created model version object
     */
    async createModelVersion(modelName, source, runId = null) {
        // is model name provided?
        if (!modelName) {
            throw new Error('modelName is required');
        }

        // is source provided?
        if (!source) {
            throw new Error('source is required');
        }

        // construct url for create model version endpoint
        const url = `${this.trackingUri}/api/2.0/mlflow/model-versions/create`;

        // build the request body with required and optional fields
        const body = {
            name: modelName,
            source: source,
            run_id: runId
        };
          
        // fire off a post request to create the model version
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // parse the response
        const data = await response.json();

        // is response ok? else throw error
        if (!response.ok) {
            throw new Error(`Error creating model version: ${data.message || response.statusText}`);
        }

        // return the model version obj 
        return data.model_version;
    }

    /**
     * fetches details of a specific model version.
     *
     * @param {string} modelName - the name of the registered model (required)
     * @param {string} version - the version number of the model to fetch (required)
     * @returns {Promise<Object>} - the fetched model version object
     */
    async getModelVersion(modelName, version) {
        // is model name provided?
        if (!modelName) {
            throw new Error('modelName is required');
        }

        // is version provided?
        if (!version) {
            throw new Error('version is required');
        }

        // construct url for get model version endpoint
        const url = `${this.trackingUri}/api/2.0/mlflow/model-versions/get`;

        // build request query params
        const params = new URLSearchParams({
            name: modelName,
            version: version
        });

        // fire off a get request to fetch the model version
        const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        // parse the response 
        const data = await response.json();

        // is response ok? else throw error
        if (!response.ok) {
            throw new Error(`Error fetching model version: ${data.message || response.statusText}`);
        }   

        // return the model version obj
        return data.model_version;
    }
  
    /**
     * updates a specific model version.
     *
     * @param {string} modelName - the name of the registered model (required)
     * @param {string} version - the version number of the model to update (required)
     * @param {Object} updates - the fields to update in the model version (required)
     * @returns {Promise<Object>} - the updated model version object
     */
    async updateModelVersion(modelName, version, updates) {
        // is model name provided?
        if (!modelName) {
            throw new Error('modelName is required');
        }

        // is version provided?
        if (!version) {
            throw new Error('version is required');
        }

        // are updates provided? is obj?
        if (!updates || typeof updates !== 'object') {
            throw new Error('updates object is required');
        }

        // construct url for update model version endpoint
        const url = `${this.trackingUri}/api/2.0/mlflow/model-versions/update`;

        // build the request body with update fields
        const body = {
            name: modelName,
            version: version,
            ...updates // spread updates into body
        };

        // fire off a patch request to update the model version
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // parse the response
        const data = await response.json();

        // is response ok? else throw error
        if (!response.ok) {
            throw new Error(`Error updating model version: ${data.message || response.statusText}`);
        }

        // return the updated model version obj
        return data.model_version;
    }

    /**
     * deletes a specific model version.
     *
     * @param {string} modelName - the name of the registered model (required)
     * @param {string} version - the version number of the model to delete (required)
     * @returns {Promise<void>} - a promise that resolves when the model version is deleted
     */
    async deleteModelVersion(modelName, version) {
        // is model name provided?
        if (!modelName) {
            throw new Error('modelName is required');
        }
        // is version provided?
        if (!version) {
            throw new Error('version is required');
        }

        // construct url for delete model version endpoint
        const url = `${this.trackingUri}/api/2.0/mlflow/model-versions/delete`;

        // build request query params
        const params = new URLSearchParams({
            name: modelName,
            version: version
        });

        // fire off a delete request to remove the model version
        const response = await fetch(`${url}?${params}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // parse the response
        const data = await response.json();

        // is response ok? else throw error
        if (!response.ok) {
            throw new Error(`Error deleting model version: ${data.message || response.statusText}`);
        }

        // return nothing, just resolve
        return;
    }

    /**
     * searches for model versions based on provided filters.
     *
     * @param {string} [filter=''] - the filter criteria for searching model versions (optional)
     * @param {number} [maxResults=100] - the maximum number of results to return (optional)
     * @returns {Promise<Array>} - an array of model versions that match the search criteria
     */
    async searchModelVersions(filter = '', maxResults = 100) {
        // construct url for search model versions endpoint
        const url = `${this.trackingUri}/api/2.0/mlflow/model-versions/search`;

        // build request query params with filter and maxResults
        const params = new URLSearchParams({
            filter: filter,
            max_results: maxResults
        });

        // fire off a get request to search for model versions
        const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // parse the response
        const data = await response.json();

        // is response ok? else throw error
        if (!response.ok) {
            throw new Error(`Error searching model versions: ${data.message || response.statusText}`);
        }

        // return an array of model versions that match the criteria
        return data.model_versions;
    }

    /**
     * retrieves the download uri for model version artifacts.
     *
     * @param {string} modelName - the name of the registered model (required)
     * @param {string} version - the version number of the model to fetch the uri for (required)
     * @returns {Promise<string>} - the uri for downloading the model version artifacts
     */
    async getDownloadUriForModelVersionArtifacts(modelName, version) {
        // is model name provided?
        if (!modelName) {
            throw new Error('modelName is required');
        }

        // is version provided?
        if (!version) {
            throw new Error('version is required');
        }

        // construct url for get download uri for model version artifacts endpoint
        const url = `${this.trackingUri}/api/2.0/mlflow/model-versions/get-download-uri`;

        // build request query params
        const params = new URLSearchParams({
            name: modelName,
            version: version
        });

        // fire off a get request to fetch the download uri
        const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // parse the response
        const data = await response.json();

        // is response ok? else throw error
        if (!response.ok) {
            throw new Error(`Error fetching download uri: ${data.message || response.statusText}`);
        }

        // return the download uri as a string
        return data.artifact_uri;
    }

    /**
     * transitions a model version to a different stage.
     *
     * @param {string} modelName - the name of the registered model (required)
     * @param {string} version - the version number of the model to transition (required)
     * @param {string} stage - the stage to transition the model version to (e.g., 'staging', 'production') (required)
     * @returns {Promise<Object>} - the updated model version object after the stage transition
     */
    async transitionModelVersionStage(modelName, version, stage) {
        // is model name provided?
        if (!modelName) {
            throw new Error('modelName is required');
        }

        // is version provided?
        if (!version) {
            throw new Error('version is required');
        }

        // is stage provided?
        if (!stage) {
            throw new Error('stage is required');
        }

        // construct url for transition model version stage endpoint
        const url = `${this.trackingUri}/api/2.0/mlflow/model-versions/transition-stage`;

        // build the request body with stage information
        const body = {
            name: modelName,
            version: version,
            stage: stage
        };

        // fire off a post request to transition the model version stage
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // parse the response
        const data = await response.json();

        // is response ok? else throw error
        if (!response.ok) {
            throw new Error(`Error transitioning model version stage: ${data.message || response.statusText}`);
        }

        // return the updated model version obj
        return data.model_version;
    }

    /**
     * sets a tag on a specific model version.
     *
     * @param {string} modelName - the name of the registered model (required)
     * @param {string} version - the version number of the model to tag (required)
     * @param {string} key - the key of the tag (required)
     * @param {string} value - the value of the tag (required)
     * @returns {Promise<void>} - a promise that resolves when the tag is set
     */
    async setModelVersionTag(modelName, version, key, value) {
        // is model name provided?
        if (!modelName) {
            throw new Error('modelName is required');
        }

        // is version provided?
        if (!version) {
            throw new Error('version is required');
        }

        // is key provided?
        if (!key) {
            throw new Error('key is required');
        }

        // is value provided?
        if (!value) {
            throw new Error('value is required');
        }

        // construct url for set model version tag endpoint
        const url = `${this.trackingUri}/api/2.0/mlflow/model-versions/set-tag`;

        // build the request body with tag key and value
        const body = {
            name: modelName,
            version: version,
            key: key,
            value: value
        };

        // fire off a post request to set the tag on the model version
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // parse the response
        const data = await response.json();

        // is response ok? else throw error
        if (!response.ok) {
            throw new Error(`Error setting model version tag: ${data.message || response.statusText}`);
        }

        // return nothing, just resolve
        return;
    }

    /**
     * deletes a tag from a specific model version.
     *
     * @param {string} modelName - the name of the registered model (required)
     * @param {string} version - the version number of the model to untag (required)
     * @param {string} key - the key of the tag to delete (required)
     * @returns {Promise<void>} - a promise that resolves when the tag is deleted
     */
    async deleteModelVersionTag(modelName, version, key) {
        // is model name provided?
        if (!modelName) {
            throw new Error('modelName is required');
        }

        // is version provided?
        if (!version) {
            throw new Error('version is required');
        }

        // is key provided?
        if (!key) {
            throw new Error('key is required');
        }

        // construct url for delete model version tag endpoint
        const url = `${this.trackingUri}/api/2.0/mlflow/model-versions/delete-tag`;

        // build request query params
        const params = new URLSearchParams({
            name: modelName,
            version: version,
            key: key
        });

        // fire off a delete request to remove the tag from the model version
        const response = await fetch(`${url}?${params}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // parse the response
        const data = await response.json();

        // is response ok? else throw error
        if (!response.ok) {
            throw new Error(`Error deleting model version tag: ${data.message || response.statusText}`);
        }

        // return nothing, just resolve
        return;
    }
}

export { ModelVersionManagement };