import { ModelManager } from "./ModelManager.js";
import { ModelVersionManagement } from "../model_registry/model_version_management.js";

// -------------TESTING----------------
const modelManager = new ModelManager('http://localhost:5001');
const modelVersionManagement = new ModelVersionManagement('http://localhost:5001');

const modelName = "WoWaNewModel_____";
const modelTagKey = `${modelName}TagKey`;
const modelTagValue = `${modelName}TagValue`;
const modelDescription = `This is ${modelName}'s description.`;
const modelVersion = "2"; // Change this value to match the demo's current model Version
const versionSource = "mlflow-artifacts:/784321942139901150/b3457c87f50440388da9d9ddabb1baaa/artifacts/iris_model";
const versionRun_id = "b3457c87f50440388da9d9ddabb1baaa";
const versionAlias = `${modelName}_Alias`;
const versionDescription = `${modelName} Description`;
const versionKey = `${modelName}_versionKey`;
const versionValue = `${modelName}_versionValue`;

// TESTING for modelManager.createRegisteredModelWithVersion
// modelManager.createRegisteredModelWithVersion(modelName, versionSource, versionRun_id);

// TESTING for modelManager.updateRegisteredModelDescriptionAndTag
// modelManager.updateRegisteredModelDescriptionAndTag(modelName, modelTagKey, modelTagValue, modelDescription);

// TESTING for modelManager.updateAllLatestModelVersion
// modelManager.updateAllLatestModelVersion(modelName, versionAlias, versionDescription, versionKey, versionValue);

// TESTING for modelManager.setLatestModelVersionTag
// modelVersionManagement.createModelVersion(modelName, versionSource, versionRun_id);
// modelManager.setLatestModelVersionTag(modelName, versionKey, versionValue);

// TESTING for modelManager.setLatestModelVersionAlias
// modelManager.setLatestModelVersionAlias(modelName, versionAlias);

// TESTING for modelManager.updateLatestModelVersion
// modelManager.updateLatestModelVersion(modelName, versionDescription);

// TESTING for modelManager.updateAllModelVersion
// modelManager.updateAllModelVersion(modelName, modelVersion, versionAlias, versionDescription, versionKey, versionValue);

// TESTING for modelManager.deleteLatestModelVersion
// modelManager.deleteLatestModelVersion(modelName);

// ---------------END OF TESTING---------------