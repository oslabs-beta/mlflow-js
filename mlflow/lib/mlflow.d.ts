import ExperimentClient from './tracking/ExperimentClient.js';
import ExperimentManager from './workflows/ExperimentManager.js';
import RunClient from './tracking/RunClient.js';
import RunManager from './workflows/RunManager.js';
import ModelRegistryClient from './model-registry/ModelRegistryClient.js';
import ModelVersionClient from './model-registry/ModelVersionClient.js';
import ModelManager from './workflows/ModelManager.js';
declare class Mlflow {
    private components;
    constructor(trackingUri: string);
    private initializeMethods;
    getExperimentClient(): ExperimentClient;
    getRunClient(): RunClient;
    getModelRegistryClient(): ModelRegistryClient;
    getModelVersionClient(): ModelVersionClient;
    getExperimentManager(): ExperimentManager;
    getRunManager(): RunManager;
    getModelManager(): ModelManager;
}
export default Mlflow;
