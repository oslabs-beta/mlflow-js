import { ExperimentManagement } from '../tracking_server/experiment_management.js';
import { RunManagement } from '../tracking_server/run_management.js';
import { ModelRegistry } from '../model_registry/model_registry.js';
import { ModelVersionManagement } from '../model_registry/model_version_management.js';
import fs from 'fs'; // Node.js file system module to handle file writing

class MLflowHousekeeper {
  constructor(trackingUri) {
    this.trackingUri = trackingUri;
    this.experimentManagement = new ExperimentManagement(trackingUri);
    this.runManagement = new RunManagement(trackingUri);
    this.modelRegistry = new ModelRegistry(trackingUri);
    this.modelVersionManagement = new ModelVersionManagement(trackingUri);
  }

  /**
   * Manages dataset versions by logging them as artifacts, versioning them, and associating these versions with specific runs.
   * @param {string} runId - The ID of the run to associate with the dataset version. (Required)
   * @param {string} datasetPath - Path to the dataset to be logged. (Required)
   * @param {string} version - Version identifier for the dataset. (Required)
   * @param {Object} [tags={}] - Optional tags to associate with the dataset version.
   * @returns {Promise<Object>} - The logged dataset version object.
   * @throws {Error} - Throws an error if the datasetPath, version, or runId is not provided.
   */
  async datasetVersionControl(runId, datasetPath, version, tags = {}) {
    if (!runId || !datasetPath || !version) {
      throw new Error('Run ID, dataset path, and version are required.');
    }

    const dataset = {
      path: datasetPath,
      version: version,
      tags: tags
    };

    // Log the dataset as an input to the run
    return await this.runManagement.logInputs(runId, [dataset]);
  }

  /**
   * Cleans up old experiments based on age and status.
   * Saves metadata to a file before deletion and logs the metadata and its save location.
   * @param {number} ageThreshold - Age in days beyond which experiments are considered old. (Required)
   * @param {Array<string>} [statusFilters=['FAILED', 'COMPLETED']] - Status filters to apply when identifying old experiments. (Optional)
   * @param {string} [metadataSavePath='./experiment_metadata'] - Directory path where metadata files will be saved. (Optional)
   * @returns {Promise<void>} - A promise that resolves when old experiments are deleted.
   * @throws {Error} - Throws an error if the cleanup process fails.
   */
  async cleanupOldExperiments(ageThreshold, statusFilters = ['FAILED', 'COMPLETED'], metadataSavePath = './experiment_metadata') {
    if (!ageThreshold) {
      throw new Error('Age threshold is required.');
    }

    // Ensure the metadata directory exists
    if (!fs.existsSync(metadataSavePath)) {
      fs.mkdirSync(metadataSavePath, { recursive: true });
    }

    const experiments = await this.experimentManagement.searchExperiment(
      `lifecycle_stage IN (${statusFilters.map(s => `'${s}'`).join(',')})`,
      1000
    );

    const currentTime = Date.now();

    for (const experiment of experiments.experiments) {
      const lastUpdateTime = new Date(experiment.last_update_time).getTime();
      const experimentAge = (currentTime - lastUpdateTime) / (1000 * 60 * 60 * 24);

      if (experimentAge > ageThreshold) {
        // Save experiment metadata to a file
        const metadataFileName = `${metadataSavePath}/experiment_${experiment.experiment_id}_metadata.json`;
        fs.writeFileSync(metadataFileName, JSON.stringify(experiment, null, 2), 'utf8');
        console.log(`Saved metadata for experiment ${experiment.experiment_id} to ${metadataFileName}`);

        // Log the metadata and its save location
        await this.runManagement.logInputs(experiment.experiment_id, [{
          path: metadataFileName,
          version: experiment.experiment_id,
          tags: {
            action: 'delete',
            saved: new Date().toISOString()
          }
        }]);

        // Delete the old experiment
        await this.experimentManagement.deleteExperiment(experiment.experiment_id);
        console.log(`Deleted experiment: ${experiment.experiment_id}`);
      }
    }
  }

  /**
   * Deletes old model versions that are in a specific stage.
   * Retains a specified maximum number of versions and deletes older versions.
   * @param {string} modelName - The name of the registered model. (Required)
   * @param {string} stage - The stage of the versions to delete (e.g., 'archived'). (Required)
   * @param {number} [maxVersions=3] - The maximum number of versions to retain. Older versions are deleted. (Optional)
   * @returns {Promise<void>} - A promise that resolves when old model versions are deleted.
   * @throws {Error} - Throws an error if the model name or stage is not provided.
   */
  async deleteOldModelVersions(modelName, stage, maxVersions = 3) {
    if (!modelName || !stage) {
      throw new Error('Model name and stage are required.');
    }

    const versions = await this.modelVersionManagement.searchModelVersions(
      `name = '${modelName}' AND current_stage = '${stage}'`,
      1000
    );

    if (versions.length > maxVersions) {
      const versionsToDelete = versions.slice(0, versions.length - maxVersions);

      for (const version of versionsToDelete) {
        await this.modelVersionManagement.deleteModelVersion(modelName, version.version);
        console.log(`Deleted model version: ${version.version} from model: ${modelName}`);
      }
    }
  }
}

export { MLflowHousekeeper };
