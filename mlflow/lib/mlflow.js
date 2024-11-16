import ExperimentClient from './tracking/ExperimentClient.js';
import ExperimentManager from './workflows/ExperimentManager.js';
import RunClient from './tracking/RunClient.js';
import RunManager from './workflows/RunManager.js';
import ModelRegistryClient from './model-registry/ModelRegistryClient.js';
import ModelVersionClient from './model-registry/ModelVersionClient.js';
import ModelManager from './workflows/ModelManager.js';
class Mlflow {
    constructor(trackingUri) {
        this.components = {
            experimentClient: new ExperimentClient(trackingUri),
            experimentManager: new ExperimentManager(trackingUri),
            runClient: new RunClient(trackingUri),
            runManager: new RunManager(trackingUri),
            modelRegistryClient: new ModelRegistryClient(trackingUri),
            modelVersionClient: new ModelVersionClient(trackingUri),
            modelManager: new ModelManager(trackingUri),
        };
        this.initializeMethods();
    }
    initializeMethods() {
        Object.keys(this.components).forEach((componentName) => {
            const component = this.components[componentName];
            Object.getOwnPropertyNames(Object.getPrototypeOf(component))
                .filter((name) => typeof component[name] === 'function' &&
                name !== 'constructor')
                .forEach((methodName) => {
                this[methodName] = (...args) => component[methodName](...args);
            });
        });
    }
    // Getter methods for direct access to clients and managers
    getExperimentClient() {
        return this.components.experimentClient;
    }
    getRunClient() {
        return this.components.runClient;
    }
    getModelRegistryClient() {
        return this.components.modelRegistryClient;
    }
    getModelVersionClient() {
        return this.components.modelVersionClient;
    }
    getExperimentManager() {
        return this.components.experimentManager;
    }
    getRunManager() {
        return this.components.runManager;
    }
    getModelManager() {
        return this.components.modelManager;
    }
}
export default Mlflow;
//# sourceMappingURL=mlflow.js.map