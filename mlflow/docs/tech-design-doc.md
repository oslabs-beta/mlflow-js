# MLflow JavaScript Library Technical Design Document


## 1. Overview


The MLflow-JS library aims to provide a comprehensive and intuitive interface for interacting with MLflow services in a JavaScript/Typescript environment. It simplifies the integration with MLflow REST APIs by offering high-level methods for tracking, model management, and advanced workflows.  


## 2. Architecture


The library follows a modular architecture with a main `MLflow` class serving as the primary entry point and separate clients for different MLflow components and workflow managers.


### 2.1 Core Components


1. **MLflow**: Main class providing access to high-level abstractions and other components.
2. **Tracking**: Module for interacting with MLflow's tracking server.
3. **Model Registry**: Module for managing models in MLflow's model registry.
4. **Workflows**: Higher-level abstractions for common workflows.
5. **Utils**: Utility functions and classes used across the library.


### 2.2 Folder Structure


```
mlflow-js/
├── src/
│   ├── tracking/
│   │   ├── ExperimentClient.ts
│   │   ├── RunClient.ts
│   ├── model-registry/
│   │   ├── ModelRegistryClient.ts
│   │   └── ModelVersionClient.ts
│   ├── workflows/
│   │   ├── ExperimentManager.ts
│   │   ├── RunManager.ts
│   │   └── ModelManager.ts
│   ├── utils/
│   │   ├── apiRequest.ts
│   │   └── apiError.ts
│   ├── mlflow.ts
│   └── index.ts
├── tests/
├── lib/
│   └── index.js
├── examples/
└── docs/
```


## 3. Component Details


### 3.1 MLflow Class


The `MLflow` class serves as the main entry point for the library. It provides:
- Access to High-level abstractions for common workflows
- Access to tracking and model registry components


### 3.2 Tracking Module


Includes clients for interacting with MLflow's tracking server:
- `ExperimentClient`: Manage experiments
- `RunClient`: Create and manage runs, log metrics/params/artifacts


### 3.3 Model Registry Module


Provides functionality for model management:
- `ModelRegistryClient`: Register and manage models
- `ModelVersionClient`: Handle model versioning and stage transitions


### 3.4 Workflows


Higher-level abstractions for common workflows:
- `ExperimentManager`: Manage experiment lifecycles
- `RunManager`: Simplify run creation and management
- `ModelManager`: Streamline model registration and promotion


### 3.5 Utils


Utility classes and functions:
- `apiRequest`: Handle HTTP requests to MLflow server
- `ApiError`: Custom error class for API-related errors


## 4. Data Flow


1. User interacts with `MLflow` instance
2. `MLflow` delegates to appropriate abstraction or client
3. Client/abstraction uses `ApiRequest` to make HTTP requests
4. `ApiRequest` sends request to MLflow server
5. Response is processed and returned to user


## 5. Testing Strategy


- Integration tests for API interactions 
- End-to-end tests with a real MLflow server and ML model


## 6. Documentation


- Comprehensive API documentation generated from JSDoc comments
- Usage examples for common scenarios
- Tutorials for getting started and advanced usage
