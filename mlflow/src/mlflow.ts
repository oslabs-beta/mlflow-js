// src/Mlflow.ts

// import ExperimentClient from './tracking/ExperimentClient';
import RunClient from './tracking/RunClient';
import ModelRegistryClient from './model-registry/ModelRegistryClient';
import ModelVersionClient from './model-registry/ModelVersionClient';
// import ExperimentManager from './workflows/ExperimentManager';
import RunManager from './workflows/RunManager';
import ModelManager from './workflows/ModelManager';

class Mlflow {
  private components: {
    // experimentClient: ExperimentClient;
    runClient: RunClient;
    modelRegistryClient: ModelRegistryClient;
    modelVersionClient: ModelVersionClient;
    // experimentManager: ExperimentManager;
    runManager: RunManager;
    modelManager: ModelManager;
  };

  constructor(trackingUri: string) {
    this.components = {
      //   experimentClient: new ExperimentClient(trackingUri),
      runClient: new RunClient(trackingUri),
      modelRegistryClient: new ModelRegistryClient(trackingUri),
      modelVersionClient: new ModelVersionClient(trackingUri),
      //   experimentManager: new ExperimentManager(trackingUri),
      runManager: new RunManager(trackingUri),
      modelManager: new ModelManager(trackingUri),
    };

    this.initializeMethods();
  }

  private initializeMethods(): void {
    Object.keys(this.components).forEach((componentName) => {
      const component =
        this.components[componentName as keyof typeof this.components];
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
    });
  }

  // Getter methods for direct access to clients and managers

  //   getExperimentClient(): ExperimentClient {
  //     return this.components.experimentClient;
  //   }

  getRunClient(): RunClient {
    return this.components.runClient;
  }

  getModelRegistryClient(): ModelRegistryClient {
    return this.components.modelRegistryClient;
  }

  getModelVersionClient(): ModelVersionClient {
    return this.components.modelVersionClient;
  }

  //   getExperimentManager(): ExperimentManager {
  //     return this.components.experimentManager;
  //   }

  getRunManager(): RunManager {
    return this.components.runManager;
  }

  getModelManager(): ModelManager {
    return this.components.modelManager;
  }
}

export default Mlflow;
