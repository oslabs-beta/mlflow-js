import ModelVersionClient from '../src/model-registry/ModelVersionClient';
import ModelRegistryClient from '../src/model-registry/ModelRegistryClient';

// To test:
// npx tsx tests/ModelVersionClientTest.ts

async function testModelVersionClient() {
  const client = new ModelVersionClient('http://localhost:5001');
  const modelRegistryClient = new ModelRegistryClient('http://localhost:5001');
  const timestamp = Date.now();
  const modelName = `test-model-${timestamp}`;
  const artifactSource = 'mlflow-artifacts:/784321942139901150/b3457c87f50440388da9d9ddabb1baaa/artifacts/iris_model';
  const run_id = 'b3457c87f50440388da9d9ddabb1baaa';
  const modelVersionDescription1 = 'This is test version 1 description';
  const modelVersionKey = 'version_1_key';
  const modelVersionValue = 'version_1_value';

  try {
    // Creating a new registered model to test on
    await modelRegistryClient.createRegisteredModel(
      modelName,
      [{ key: 'test-tag', value: 'test-value' }],
      'This is a test model'
    );

    // 1. Creating a registered model version
    console.log('1. Creating a new registered model version...');
    const createdModelVersion = await client.createModelVersion(
      modelName,
      artifactSource,
      run_id,
      [{ key: 'test-tag', value: 'test-value' }],
    );
    console.log('Created model version: ', createdModelVersion);

    // 2. Getting the specified version of the model
    console.log('2. Getting the specified version of a model...');
    const retrievedModelVersion = await client.getModelVersion(modelName, '1');
    console.log('Retrieved model version: ', retrievedModelVersion);

    // 3. Updating a model version's description
    console.log('3. Updating the specified version of a model\'s description...');
    const updatedModelVersionDescription = await client.updateModelVersion(
      modelName,
      '1',
      modelVersionDescription1
    );
    console.log('Updated model version description: ', updatedModelVersionDescription);

    // 4. Searching for model versions based on provided filters
    // Still need to test page_token
    console.log('4. Seaching for model versions based on provided filters...');
    const filteredModelVersions = await client.searchModelVersions(
      `name='${modelName}'`,
      5,
      ["name"]
    )
    console.log('Filtered model version(s): ', filteredModelVersions);

    // 5. Retrieving the download uri for model version artifacts.
    console.log('5. Retrieving the download uri for model version artifacts...')
    const downloadURI = await client.getDownloadUriForModelVersionArtifacts(
      modelName,
      '1'
    )
    console.log('Download URI for ModelVersion Artifacts: ', downloadURI);

    // 6. Transitioning model version stage.
    console.log('6. Transitioning model version stage...');
    const transitionedModelVersion = await client.transitionModelVersionStage(
      modelName,
      '1',
      'production',
      true
    )
    console.log('Transitioned model version: ', transitionedModelVersion);

    // 7. Setting model version tag
    console.log('7. Setting model version tag...');
    const modelVersionTag = await client.setModelVersionTag(
      modelName,
      '1',
      modelVersionKey,
      modelVersionValue
    )
    console.log('Set model version tag');

    // 8. Deleting model version tag
    console.log('8. Deleting model version tag...');
    const deletedModelVersionTag = await client.deleteModelVersionTag(
      modelName,
      '1',
      modelVersionKey
    )
    console.log('Deleted model version tag');

    // 9. Deleting model version
    console.log('9. Deleting model version...');
    const deletedModelVersion = await client.deleteModelVersion(
      modelName,
      '1',
    )
    console.log('Deleted model version');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testModelVersionClient();
