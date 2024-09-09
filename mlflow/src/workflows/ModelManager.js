import { ModelRegistry } from '../model_registry/model_registry.js';
import { ModelVersionManagement } from '../model_registry/model_version_management.js';

class ModelManager {
  constructor(trackingUri) {
    this.trackingUri = trackingUri;
    this.modelRegistry = new ModelRegistry(trackingUri);
    this.modelVersionManagement = new ModelVersionManagement(trackingUri);
  }

  /**
   *
   * @param {string} name - Name of the registered model. (Required)
   * @param {string} versionSource - URI indicating the location of the model artifacts. (Required)
   * @param {string} versionRun_id - MLflow run ID for correlation, if versionSource was generated
   * by an experiment run in MLflow tracking server.
   * @returns {Promise<Object>} - the updated model version object
   */
  async createRegisteredModelWithVersion(name, versionSource, versionRun_id) {
    await this.modelRegistry.createRegisteredModel(name);
    const response = await this.modelVersionManagement.createModelVersion(
      name,
      versionSource,
      versionRun_id
    );
    return response;
  }

  /**
   *
   * @param {string} name - Name of the registered model. (Required)
   * @param {string} tagKey - Name of the tag. (Required)
   * @param {string} tagValue - String value of the tag being logged. (Required)
   * @param {string} description - Description of the registered model.
   * @returns {Promise<Object>} - the updated registered model object
   */
  async updateRegisteredModelDescriptionAndTag(
    name,
    tagKey,
    tagValue,
    description
  ) {
    await this.modelRegistry.setRegisteredModelTag(name, tagKey, tagValue);
    const response = await this.modelRegistry.updateRegisteredModel(
      name,
      description
    );
    return response;
  }

  /**
   *
   * @param {string} name - Name of the registered model. (Required)
   * @param {string} alias - Name of the alias. (Required)
   * @param {string} description - The description for the model version. (Required)
   * @param {string} key - Name of the tag. (Required)
   * @param {string} value - Name of the value of the tag being logged. (Required)
   * @returns {Promise<Object>} - the updated model version object
   */
  async updateAllLatestModelVersion(name, alias, description, key, value) {
    const data = await this.modelRegistry.getLatestModelVersions(name);
    if (!data) {
      throw new Error('Model has no version to update.');
    } else {
      const [{ version }] = data;
      await this.modelRegistry.setRegisteredModelAlias(name, alias, version);
      await this.modelVersionManagement.setModelVersionTag(
        name,
        version,
        key,
        value
      );
      const response = await this.modelVersionManagement.updateModelVersion(
        name,
        version,
        description
      );
      return response;
    }
  }

  /**
   *
   * @param {string} name - Name of the registered model. (Required)
   * @param {string} key - Name of the tag. (Required)
   * @param {string} value - Name of the value of the tag being logged. (Required)
   * @returns {Promise<void>} - a promise that resolves when the model version is deleted
   */
  async setLatestModelVersionTag(name, key, value) {
    const data = await this.modelRegistry.getLatestModelVersions(name);
    if (!data) {
      throw new Error('Model has no version to set tag for.');
    } else {
      const [{ version }] = data;
      this.modelVersionManagement.setModelVersionTag(name, version, key, value);
      return;
    }
  }

  /**
   *
   * @param {string} name - Name of the registered model. (Required)
   * @param {string} alias - Name of the alias. (Required)
   * @returns {Promise<void>} - a promise that resolves when the model version is deleted
   */
  async setLatestModelVersionAlias(name, alias) {
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
   *
   * @param {string} name - Name of the registered model. (Required)
   * @param {string} description - The description for the model version. (Required)
   * @returns {Promise<Object>} - the updated model version object
   */
  async updateLatestModelVersion(name, description) {
    const data = await this.modelRegistry.getLatestModelVersions(name);
    if (!data) {
      throw new Error('Model has no version to set description for.');
    } else {
      const [{ version }] = data;
      const response = await this.modelVersionManagement.updateModelVersion(
        name,
        version,
        description
      );
      return response;
    }
  }

  /**
   *
   * @param {string} name - Name of the registered model. (Required)
   * @param {string} version - Model version number. (Required)
   * @param {string} alias - Name of the alias. (Required)
   * @param {string} description - The description for the model version. (Required)
   * @param {string} key key - Name of the tag. (Required)
   * @param {string} value - Name of the value of the tag being logged. (Required)
   * @returns {Promise<Object>} - the updated model version object
   */
  async updateAllModelVersion(name, version, alias, description, key, value) {
    await this.modelRegistry.setRegisteredModelAlias(name, alias, version);
    await this.modelVersionManagement.setModelVersionTag(
      name,
      version,
      key,
      value
    );
    const response = await this.modelVersionManagement.updateModelVersion(
      name,
      version,
      description
    );
    return response;
  }

  /**
   *
   * @param {string} name - the model name
   * @returns {Promise<void>} - a promise that resolves when the model version is deleted
   */
  async deleteLatestModelVersion(name) {
    const data = await this.modelRegistry.getLatestModelVersions(name);
    if (!data) {
      throw new Error('Model has no version to delete.');
    } else {
      const [{ version }] = data;
      this.modelVersionManagement.deleteModelVersion(name, version);
      return;
    }
  }
}

export { ModelManager };
