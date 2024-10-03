// import RunClient from '@tracking/RunClient';
import ModelRegistryClient from '@model-registry/ModelRegistryClient';
import ModelVersionClient from '@model-registry/ModelVersionClient';
import { ApiError } from '@utils/apiError';

class ModelManager {
  private modelRegistry: ModelRegistryClient;
  private modelVersion: ModelVersionClient;

  constructor(trackingUri: string) {
    this.modelRegistry = new ModelRegistryClient(trackingUri);
    this.modelVersion = new ModelVersionClient(trackingUri);
    // this.runClient = new RunClient(trackingUri);
  }

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
  async createRegisteredModelWithVersion(
    name: string,
    versionSource: string,
    versionRun_id: string
  ): Promise<object> {
    try {
      await this.modelRegistry.createRegisteredModel(name);
      const response = await this.modelVersion.createModelVersion(
        name,
        versionSource,
        versionRun_id
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error (${error.statusCode}): ${error.message}`);
        throw error;
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error();
      }
    }
  }

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
  async updateRegisteredModelDescriptionAndTag(
    name: string,
    tagKey: string,
    tagValue: string,
    description: string
  ): Promise<object> {
    try {
      await this.modelRegistry.setRegisteredModelTag(name, tagKey, tagValue);
      const response = await this.modelRegistry.updateRegisteredModel(
        name,
        description
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error (${error.statusCode}): ${error.message}`);
        throw error;
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error();
      }
    }
  }

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
  async updateAllLatestModelVersion(
    name: string,
    alias: string,
    description: string,
    key: string,
    value: string
  ): Promise<object> {
    try {
      const data = await this.modelRegistry.getLatestModelVersions(name);
      if (!data) {
        throw new Error('Model has no version to update.');
      } else {
        const [{ version }] = data;
        await this.modelRegistry.setRegisteredModelAlias(name, alias, version);
        await this.modelVersion.setModelVersionTag(name, version, key, value);
        const response = await this.modelVersion.updateModelVersion(
          name,
          version,
          description
        );
        return response;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error (${error.statusCode}): ${error.message}`);
        throw error;
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error();
      }
    }
  }

  /**
   * Adds a new tag key/value for the latest version of the specified registered model.
   *
   * @param {string} name - Name of the registered model. (Required)
   * @param {string} key - Name of the tag. (Required)
   * @param {string} value - Name of the value of the tag being logged. (Required)
   * @returns {Promise<void>} - a promise that resolves when the model version is deleted
   * @throws {ApiError | Error} If request fails
   */
  async setLatestModelVersionTag(
    name: string,
    key: string,
    value: string
  ): Promise<void> {
    try {
      const data = await this.modelRegistry.getLatestModelVersions(name);
      if (!data) {
        throw new Error('Model has no version to set tag for.');
      } else {
        const [{ version }] = data;
        this.modelVersion.setModelVersionTag(name, version, key, value);
        return;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error (${error.statusCode}): ${error.message}`);
        throw error;
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error();
      }
    }
  }

  /**
   * Adds an alias for the latest version of the specified registered model.
   *
   * @param {string} name - Name of the registered model. (Required)
   * @param {string} alias - Name of the alias. (Required)
   * @returns {Promise<void>} - a promise that resolves when the model version is deleted
   * @throws {ApiError | Error} If request fails
   */
  async setLatestModelVersionAlias(name: string, alias: string): Promise<void> {
    try {
      const data = await this.modelRegistry.getLatestModelVersions(name);
      if (!data) {
        throw new Error('Model has no version to set alias for.');
      } else {
        const [{ version }] = data;
        this.modelRegistry.setRegisteredModelAlias(name, alias, version);
        return;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error (${error.statusCode}): ${error.message}`);
        throw error;
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error();
      }
    }
  }

  /**
   * Updates the description of the latest version of a registered model.
   *
   * @param {string} name - Name of the registered model. (Required)
   * @param {string} description - The description for the model version. (Required)
   * @returns {Promise<Model Version>} - the updated model version object
   * @throws {ApiError | Error} If request fails
   */
  async updateLatestModelVersion(
    name: string,
    description: string
  ): Promise<object> {
    try {
      const data = await this.modelRegistry.getLatestModelVersions(name);
      if (!data) {
        throw new Error('Model has no version to set description for.');
      } else {
        const [{ version }] = data;
        const response = await this.modelVersion.updateModelVersion(
          name,
          version,
          description
        );
        return response;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error (${error.statusCode}): ${error.message}`);
        throw error;
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error();
      }
    }
  }

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
  async updateAllModelVersion(
    name: string,
    version: string,
    alias: string,
    key: string,
    value: string,
    description: string
  ): Promise<object> {
    try {
      await this.modelRegistry.setRegisteredModelAlias(name, alias, version);
      await this.modelVersion.setModelVersionTag(name, version, key, value);
      const response = await this.modelVersion.updateModelVersion(
        name,
        version,
        description
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error (${error.statusCode}): ${error.message}`);
        throw error;
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error();
      }
    }
  }

  /**
   * Deletes the latest version of the specified registered model.
   *
   * @param {string} name - the model name
   * @returns - a promise that resolves when the model version is deleted
   * @throws {ApiError | Error} If request fails
   */
  async deleteLatestModelVersion(name: string): Promise<void> {
    try {
      const data = await this.modelRegistry.getLatestModelVersions(name);
      if (!data) {
        throw new Error('Model has no version to delete.');
      } else {
        const [{ version }] = data;
        this.modelVersion.deleteModelVersion(name, version);
        return;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error (${error.statusCode}): ${error.message}`);
        throw error;
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error();
      }
    }
  }

  /**
   * Looks through the runs with the given experiment id and through their metrics
   * looking for the specified metric that has the highest or lowest value (can be specified).
   * Then it creates a new model with the specified model name and creates a version of that
   * model from the run with the best metric.
   *
   * @param {string[]} experiment_ids - An array containing an experiment id. (Required)
   * @param {string} filterMetric - The name of the metric that we're filtering by. (Required)
   * @param {string} metricMinOrMax - A string specifying if we want the minimum or maximum
   *                                  value of the specified metric. (Required)
   * @param {string} modelName - The name of the new model that will be created. (Required)
   * @returns {Promise<void>}
   * @throws {ApiError | Error} If request fails
   */
  // async createModelFromRunWithBestMetric(
  //   experiment_ids: string[],
  //   filterMetric: string,
  //   metricMinOrMax: string,
  //   modelName: string
  // ): Promise<any> {
  //   try {
  //     const { runs } = await this.runClient.searchRuns(
  //       experiment_ids,
  //       `metrics.${filterMetric} != -99999`
  //     );
  //     let num;
  //     if (metricMinOrMax === 'min') {
  //       num = Infinity;
  //     } else if (metricMinOrMax === 'max') {
  //       num = -Infinity;
  //     }
  //     let bestRun;
  //     for (let i = 0; i < runs.length; i++) {
  //       for (let x = 0; x < runs[i].data.metrics.length; x++) {
  //         if (runs[i].data.metrics[x].key === `${filterMetric}`) {
  //           if (
  //             metricMinOrMax === 'min' &&
  //             num > runs[i].data.metrics[x].value
  //           ) {
  //             num = runs[i].data.metrics[x].value;
  //             bestRun = runs[i];
  //           } else if (
  //             metricMinOrMax === 'max' &&
  //             num < runs[i].data.metrics[x].value
  //           ) {
  //             num = runs[i].data.metrics[x].value;
  //             bestRun = runs[i];
  //           }
  //         }
  //       }
  //     }
  //     await this.modelRegistry.createRegisteredModel(modelName);
  //     await this.modelVersion.createModelVersion(
  //       modelName,
  //       bestRun.info.artifact_uri,
  //       bestRun.info.run_id
  //     );
  // return
  //   } catch (error) {
  //     if (error instanceof ApiError) {
  //       console.error(`API Error (${error.statusCode}): ${error.message}`);
  //     } else {
  //       console.error('An unexpected error occurred:', error);
  //     }
  //   }
  // }
}

export { ModelManager };
