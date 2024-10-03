import { ModelManager } from '../src/workflows/ModelManager';
import { apiRequest } from '../src/utils/apiRequest';
import ModelRegistryClient from '../src/model-registry/ModelRegistryClient';

async function createRun(
  client: ModelRegistryClient,
  experimentId: string
): Promise<any> {
  const { response, data } = await apiRequest(
    (client as any).baseUrl,
    'runs/create',
    {
      method: 'POST',
      body: { experiment_id: experimentId },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error creating run: ${data.message || response.statusText}`
    );
  }

  return data.run;
}

// npx tsx tests/ModelManagerTest.ts

async function testModelManager() {
  const modelRegistryClient = new ModelRegistryClient('http://localhost:5001');
  const modelManager = new ModelManager('http://localhost:5001');
  const timestamp = Date.now();
  const modelName = `test-model-${timestamp}`;
  const modelDescription = `test-model-description-${timestamp}`;
  const modelTagKey = `test-model-tagKey-${timestamp}`;
  const modelTagValue = `test-model-tagValue-${timestamp}`;
  const modelVersionDescription = `This is test version 1 description: ${timestamp}`;
  const modelVersionTagKey = `version_1_key_${timestamp}`;
  const modelVersionTagValue = `version_1_value_${timestamp}`;
  const modelVersionAlias = `version_1_alias_${timestamp}`;
  const modelVersion = '1';

  console.log('\n5. Creating a run...');
  const run = await createRun(modelRegistryClient, '0'); // Using '0' as the default experiment ID
  console.log('Created run:', run);

  console.log('1. Creating a new registered model with a version...');
  const newModelVersion = await modelManager.createRegisteredModelWithVersion(
    modelName,
    run.info.artifact_uri,
    run.info.run_id
  );
  console.log(`Created ${modelName} Version: `, newModelVersion);

  console.log("2. Updating a model's description and tag...");
  const updatedModelDescriptionAndTag =
    await modelManager.updateRegisteredModelDescriptionAndTag(
      modelName,
      modelTagKey,
      modelTagValue,
      modelDescription
    );
  console.log(
    `Updated ${modelName} description and tag: `,
    updatedModelDescriptionAndTag
  );

  console.log(
    "3. Updating the latest model version's alias, tag, and description..."
  );
  const updatedLatestModelVersionAll = await modelManager.updateAllLatestModelVersion(
    modelName,
    modelVersionAlias,
    modelVersionDescription,
    modelVersionTagKey,
    modelVersionTagValue
  );
  console.log(`Updated latest version of ${modelName}'s alias, tag, and description: `, updatedLatestModelVersionAll);

  console.log("4. Updating the latest model version's tag...");
  const updatedModelVersionTag = await modelManager.setLatestModelVersionTag(
    modelName,
    modelVersionTagKey,
    modelVersionTagValue
  );
  console.log(`Updated ${modelName} version tag`);

  console.log('5. Updating the latest model version\'s alias...');
  const updatedModelVersionAlias = await modelManager.setLatestModelVersionAlias(
    modelName,
    modelVersionAlias
  )
  console.log(`Updated ${modelName} version alias`);

  console.log('6. Updating the description of the latest model version...');
  const updatedModelVersionDescription = await modelManager.updateLatestModelVersion(
    modelName,
    modelDescription
  );
  console.log(`Updated ${modelName} version description: `, updatedModelVersionDescription);

  console.log('7. Updating the specified version\'s alias, tag, and description...');
  const updatedModelVersionAll = await modelManager.updateAllModelVersion(
    modelName,
    modelVersion,
    modelVersionAlias,
    modelVersionTagKey,
    modelVersionTagValue,
    modelVersionDescription
  );
  console.log('Updated model version: ', updatedModelVersionAll);

  console.log(`8. Deleting the latest version of the model...`);
  const deletedModelVersion = await modelManager.deleteLatestModelVersion(
    modelName
  );
  console.log(`Deleted Latest version of ${modelName}`);
}

testModelManager();
