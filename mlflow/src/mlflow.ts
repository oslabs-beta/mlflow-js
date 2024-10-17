import ExperimentClient from './tracking/ExperimentClient';
import ExperimentManager from './workflows/ExperimentManager';
import RunClient from './tracking/RunClient';
import RunManager from './workflows/RunManager';
import ModelRegistryClient from './model-registry/ModelRegistryClient';
import ModelVersionClient from './model-registry/ModelVersionClient';
import ModelManager from './workflows/ModelManager';

// Define a type for the components
type Components = {
    experimentClient: ExperimentClient;
    experimentManager: ExperimentManager;
    runClient: RunClient;
    runManager: RunManager;
    modelRegistryClient: ModelRegistryClient;
    modelVersionClient: ModelVersionClient;
    modelManager: ModelManager;
  };

class Mlflow {
    private components: Components;

  constructor(trackingUri: string) {
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
      const component = this.components[componentName as keyof Components];
      Object.getOwnPropertyNames(Object.getPrototypeOf(component))
        .filter(
          (name) =>
            typeof (component as keyof typeof component)[name] === 'function' && name !== 'constructor'
        )
        .forEach((methodName) => {
          (this as any)[methodName] = (...args: unknown[]) => (component as any)[methodName as any](...args);
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