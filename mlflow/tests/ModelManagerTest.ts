import { ModelManager } from '../src/workflows/ModelManager';
import { apiRequest } from '../src/utils/apiRequest';
import ModelVersionClient from '../src/model-registry/ModelVersionClient';
import ModelRegistryClient from '../src/model-registry/ModelRegistryClient';

const timestamp = Date.now();
const modelName = `test-model-${timestamp}`;
const modelVersionDescription1 = 'This is test version 1 description';
const modelVersionKey = 'version_1_key';
const modelVersionValue = 'version_1_value';

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

async function testModelManager() {
  const modelRegistryClient = new ModelRegistryClient('http://localhost:5001');

  // Uncommenting this gives us an API Error in createRegisteredModelWithVersion
  await modelRegistryClient.createRegisteredModel(
    modelName,
    [{ key: 'test-tag', value: 'test-value' }],
    'This is a test model'
  );

  console.log('\n5. Creating a run...');
  const run = await createRun(modelRegistryClient, '0'); // Using '0' as the default experiment ID
  console.log('Created run:', run);

  console.log('1. Creating a new registered model with a version');
  const modelManager = new ModelManager('http://localhost:5001');
  const newModelVersion = await modelManager.createRegisteredModelWithVersion(
    modelName,
    run.info.artifact_uri,
    run.info.run_id
  );
  console.log('Created Model Version: ', newModelVersion);
}

testModelManager();
