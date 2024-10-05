import ExperimentClient from './tracking/ExperimentClient';
import ExperimentManager from './workflows/ExperimentManager';
import RunClient from './tracking/RunClient';
import RunManager from './workflows/RunManager';
import ModelRegistryClient from './model-registry/ModelRegistryClient';
import ModelVersionClient from './model-registry/ModelVersionClient';
import ModelManager from './workflows/ModelManager';

class Mlflow {
  constructor(trackingUri) {
    this.components = {
      experimentClient: new ExperimentClient(trackingUri),
      runClient: new RunClient(trackingUri),
      modelRegistryClient: new ModelRegistryClient(trackingUri),
      modelVersionClient: new ModelVersionClient(trackingUri),
      experimentManager: new ExperimentManager(trackingUri),
      runManager: new RunManager(trackingUri),
      modelManager: new ModelManager(trackingUri),
    };

    this.initializeMethods();
  }

  initializeMethods() {
    Object.keys(this.components).forEach((componentName) => {
      const component = this.components[componentName];
      Object.getOwnPropertyNames(Object.getPrototypeOf(component))
        .filter(
          (name) =>
            typeof component[name] === 'function' && name !== 'constructor'
        )
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
