// import RunClient from '../tracking/RunClient';
import ModelRegistryClient from "../model-registry/ModelRegistryClient";
import ModelVersionClient from "../model-registry/ModelVersionClient";

class ModelManager {
  private modelRegistry: ModelRegistryClient;
  private modelVersion: ModelVersionClient;

  constructor(trackingUri: string) {
    this.modelRegistry = new ModelRegistryClient(trackingUri);
    this.modelVersion = new ModelVersionClient(trackingUri);
    // this.runClient = new RunClient(trackingUri);
  }

  /**
   * Description - Creates a new registered model and creates the first version of that model.
   * @param {string} name - Name of the registered model. (Required)
   * @param {string} versionSource - URI indicating the location of the model artifacts. (Required)
   * @param {string} versionRun_id - MLflow run ID for correlation, if versionSource was generated
   * by an experiment run in MLflow tracking server.
   * @returns {Promise<Object>} - the updated model version object
   */
  async createRegisteredModelWithVersion(name: string, versionSource: string, versionRun_id: string): Promise<object> {
    await this.modelRegistry.createRegisteredModel(name);
    const response = await this.modelVersion.createModelVersion(
      name,
      versionSource,
      versionRun_id
    );
    return response;
  }

  /**
   * Description - Updates a registered model's description and tag.
   * @param name - Name of the registered model. (Required)
   * @param tagKey - Name of the tag. (Required)
   * @param tagValue - String value of the tag being logged. (Required)
   * @param description - Description of the registered model.
   * @returns - the updated registered model object
   */
  async updateRegisteredModelDescriptionAndTag(
    name: string,
    tagKey: string,
    tagValue: string,
    description: string
  ): Promise<object> {
    await this.modelRegistry.setRegisteredModelTag(name, tagKey, tagValue);
    const response = await this.modelRegistry.updateRegisteredModel(
      name,
      description
    );
    return response;
  }

  /**
   * Description - Updates the latest version of the specified registered model's description.
   * And adds a new alias, and tag key/value for that latest version.
   * @param name - Name of the registered model. (Required)
   * @param alias - Name of the alias. (Required)
   * @param description - The description for the model version. (Required)
   * @param key - Name of the tag. (Required)
   * @param value - Name of the value of the tag being logged. (Required)
   * @returns - the updated model version object
   */
  async updateAllLatestModelVersion(name: string, alias: string, description: string, key: string, value: string): Promise<object> {
    const data = await this.modelRegistry.getLatestModelVersions(name);
    if (!data) {
      throw new Error('Model has no version to update.');
    } else {
      const [{ version }] = data;
      await this.modelRegistry.setRegisteredModelAlias(name, alias, version);
      await this.modelVersion.setModelVersionTag(
        name,
        version,
        key,
        value
      );
      const response = await this.modelVersion.updateModelVersion(
        name,
        version,
        description
      );
      return response;
    }
  }

  /**
   * Description - Adds a new tag key/value for the latest version of the specified registered model.
   * @param name - Name of the registered model. (Required)
   * @param key - Name of the tag. (Required)
   * @param value - Name of the value of the tag being logged. (Required)
   * @returns - a promise that resolves when the model version is deleted
   */
  async setLatestModelVersionTag(name: string, key: string, value: string): Promise<void> {
    const data = await this.modelRegistry.getLatestModelVersions(name);
    if (!data) {
      throw new Error('Model has no version to set tag for.');
    } else {
      const [{ version }] = data;
      this.modelVersion.setModelVersionTag(name, version, key, value);
      return;
    }
  }

  /**
   * Description - Adds an alias for the latest version of the specified registered model.
   * @param name - Name of the registered model. (Required)
   * @param alias - Name of the alias. (Required)
   * @returns - a promise that resolves when the model version is deleted
   */
  async setLatestModelVersionAlias(name: string, alias: string): Promise<void> {
    const data = await this.modelRegistry.getLatestModelVersions(name);
    if (!data) {
      throw new Error('Model has no version to set alias for.');
    } else {
      const [{ version }] = data;
      this.modelRegistry.setRegisteredModelAlias(name, alias, version);
      return;
    }
  }

  /**
   * Description - Updates the description of the latest version of a registered model.
   * @param name - Name of the registered model. (Required)
   * @param description - The description for the model version. (Required)
   * @returns - the updated model version object
   */
  async updateLatestModelVersion(name: string, description: string): Promise<object> {
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
  }

  /**
   * Description - Updates the specified version of the specified registered model's description.
   * And adds a new alias, and tag key/value for that specified version.
   * @param name - Name of the registered model. (Required)
   * @param version - Model version number. (Required)
   * @param alias - Name of the alias. (Required)
   * @param description - The description for the model version. (Required)
   * @param key key - Name of the tag. (Required)
   * @param value - Name of the value of the tag being logged. (Required)
   * @returns - the updated model version object
   */
  async updateAllModelVersion(name: string, version: string, alias: string, description: string, key: string, value: string): Promise<object> {
    await this.modelRegistry.setRegisteredModelAlias(name, alias, version);
    await this.modelVersion.setModelVersionTag(
      name,
      version,
      key,
      value
    );
    const response = await this.modelVersion.updateModelVersion(
      name,
      version,
      description
    );
    return response;
  }

  /**
   * Description - Deletes the latest version of the specified registered model.
   * @param name - the model name
   * @returns - a promise that resolves when the model version is deleted
   */
  async deleteLatestModelVersion(name: string): Promise<void> {
    const data = await this.modelRegistry.getLatestModelVersions(name);
    if (!data) {
      throw new Error('Model has no version to delete.');
    } else {
      const [{ version }] = data;
      this.modelVersion.deleteModelVersion(name, version);
      return;
    }
  }

  // Set it up so they can specify if they want the specified metric that is the greatest value, or the lowest value

  // Probably make it so it can also make a new model version if there's already a version of that modelName
  /**
   * Description - Looks through the runs with the given experiment id and through their metrics
   * looking for the specified metric that has the highest or lowest value (can be specified).
   * Then it creates a new model with the specified model name and creates a version of that
   * model from the run with the best metric.
   * @param {string[]} experiment_ids - An array containing an experiment id. (Required)
   * @param {string} filterMetric - The name of the metric that we're filtering by. (Required)
   * @param {string} metricMinOrMax - A string specifying if we want the minimum or maximum
   *                                  value of the specified metric. (Required)
   * @param {string} modelName - The name of the new model that will be created. (Required)
   */
  async createModelFromRunWithBestMetric(
    experiment_ids: string[],
    filterMetric: string,
    metricMinOrMax: string,
    modelName: string
  ) {
    const { runs } = await this.runClient.searchRuns(
      experiment_ids,
      `metrics.${filterMetric} != -99999`
    );
    let num;
    if (metricMinOrMax === 'min') {
      num = Infinity;
    } else if (metricMinOrMax === 'max') {
      num = -Infinity;
    }
    let bestRun;
    for (let i = 0; i < runs.length; i++) {
      for (let x = 0; x < runs[i].data.metrics.length; x++) {
        if (runs[i].data.metrics[x].key === `${filterMetric}`) {
          if (metricMinOrMax === 'min' && num > runs[i].data.metrics[x].value) {
            num = runs[i].data.metrics[x].value;
            bestRun = runs[i];
          } else if (
            metricMinOrMax === 'max' &&
            num < runs[i].data.metrics[x].value
          ) {
            num = runs[i].data.metrics[x].value;
            bestRun = runs[i];
          }
        }
      }
    }
    await this.modelRegistry.createRegisteredModel(modelName);
    await this.modelVersion.createModelVersion(
      modelName,
      bestRun.info.artifact_uri,
      bestRun.info.run_id
    );
  }
}

export { ModelManager };
