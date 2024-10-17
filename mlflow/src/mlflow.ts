import ExperimentClient from './tracking/ExperimentClient';
import ExperimentManager from './workflows/ExperimentManager';
import RunClient from './tracking/RunClient';
import RunManager from './workflows/RunManager';
import ModelRegistryClient from './model-registry/ModelRegistryClient';
import ModelVersionClient from './model-registry/ModelVersionClient';
import ModelManager from './workflows/ModelManager';

type ComponentName = keyof Mlflow['components'];

class Mlflow {
  private components: {
    experimentClient: ExperimentClient;
    experimentManager: ExperimentManager;
    runClient: RunClient;
    runManager: RunManager;
    modelRegistryClient: ModelRegistryClient;
    modelVersionClient: ModelVersionClient;
    modelManager: ModelManager;
  };

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

  private initializeMethods(): void {
    (Object.keys(this.components) as ComponentName[]).forEach(
      (componentName) => {
        const component = this.components[componentName];
        Object.getOwnPropertyNames(Object.getPrototypeOf(component))
          .filter(
            (name) =>
              typeof (component as any)[name] === 'function' &&
              name !== 'constructor'
          )
          .forEach((methodName) => {
            (this as any)[methodName] = (...args: any[]) =>
              (component as any)[methodName](...args);
          });
      }
    );
  }

  // Getter methods for direct access to clients and managers
  getExperimentClient(): ExperimentClient {
    return this.components.experimentClient;
  }

  getRunClient(): RunClient {
    return this.components.runClient;
  }

  getModelRegistryClient(): ModelRegistryClient {
    return this.components.modelRegistryClient;
  }

  getModelVersionClient(): ModelVersionClient {
    return this.components.modelVersionClient;
  }

  getExperimentManager(): ExperimentManager {
    return this.components.experimentManager;
  }

  getRunManager(): RunManager {
    return this.components.runManager;
  }

  getModelManager(): ModelManager {
    return this.components.modelManager;
  }
}

export default Mlflow;
