import ModelRegistryClient from '../src/model-registry/ModelRegistryClient';
import apiRequest from '../src/utils/ApiRequest';

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

async function getRun(
  client: ModelRegistryClient,
  runId: string
): Promise<any> {
  const { response, data } = await apiRequest(
    (client as any).baseUrl,
    'runs/get',
    {
      method: 'GET',
      params: { run_id: runId },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error getting run: ${data.message || response.statusText}`
    );
  }

  return data.run;
}

async function createModelVersion(
  client: ModelRegistryClient,
  name: string,
  source: string,
  runId: string
): Promise<any> {
  const { response, data } = await apiRequest(
    (client as any).baseUrl,
    'model-versions/create',
    {
      method: 'POST',
      body: { name, source, run_id: runId },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error creating model version: ${data.message || response.statusText}`
    );
  }

  return data.model_version;
}

async function testModelRegistryClient() {
  const client = new ModelRegistryClient('http://localhost:5001');
  const timestamp = Date.now();
  const baseName = `test-model-${timestamp}`;
  const renamedBaseName = `renamed-test-model-${timestamp}`;
  const customAlias = `test-alias-v1-${timestamp}`;

  try {
    // 1. Test creating a registered model
    console.log('1. Creating a new registered model...');
    const newModel = await client.createRegisteredModel(
      baseName,
      [{ key: 'test-tag', value: 'test-value' }],
      'This is a test model'
    );
    console.log('Created model:', newModel);

    // 2. Test getting the registered model
    console.log('\n2. Getting the registered model...');
    const retrievedModel = await client.getRegisteredModel(baseName);
    console.log('Retrieved model:', retrievedModel);

    // 3. Test renaming the registered model
    console.log('\n3. Renaming the registered model...');
    const renamedModel = await client.renameRegisteredModel(
      baseName,
      renamedBaseName
    );
    console.log('Renamed model:', renamedModel);

    // 4. Test updating the model description
    console.log('\n4. Updating the model description...');
    const updatedModel = await client.updateRegisteredModel(
      renamedBaseName,
      'Updated description'
    );
    console.log('Updated model:', updatedModel);

    // 5. Create a run
    console.log('\n5. Creating a run...');
    const run = await createRun(client, '0'); // Using '0' as the default experiment ID
    console.log('Created run:', run);

    // 6. Get the run to retrieve the artifact URI
    console.log('\n6. Getting run details...');
    const runDetails = await getRun(client, run.info.run_id);
    console.log('Run artifact URI:', runDetails.info.artifact_uri);

    // 7. Test creating a model version
    console.log('\n7. Creating a model version...');
    const modelVersion = await createModelVersion(
      client,
      renamedBaseName,
      runDetails.info.artifact_uri + '/model', // Assuming 'model' as the artifact path
      run.info.run_id
    );
    console.log('Created model version:', modelVersion);

    // 8. Test getting latest versions
    console.log('\n8. Getting latest versions...');
    const latestVersions = await client.getLatestModelVersions(renamedBaseName);
    console.log('Latest versions:', latestVersions);

    // 9. Test searching for models with pagination
    console.log('\n9. Searching for models with pagination...');

    // Create additional models to ensure we have enough for pagination
    for (let i = 0; i < 5; i++) {
      await client.createRegisteredModel(`${renamedBaseName}-extra-${i}`);
    }

    // Perform initial search with a small max_results to force pagination
    const initialSearchResults = await client.searchRegisteredModels(
      `name LIKE '${renamedBaseName}%'`,
      3, // Small max_results to force pagination
      ['name ASC']
    );
    console.log(
      'Initial search results:',
      initialSearchResults.registered_models
    );
    console.log('Next page token:', initialSearchResults.next_page_token);

    if (initialSearchResults.next_page_token) {
      // Perform second search using the page token
      const secondSearchResults = await client.searchRegisteredModels(
        `name LIKE '${renamedBaseName}%'`,
        3,
        ['name ASC'],
        initialSearchResults.next_page_token
      );
      console.log(
        'Second search results:',
        secondSearchResults.registered_models
      );
      console.log('Next page token:', secondSearchResults.next_page_token);
    } else {
      console.log('No more pages available');
    }

    // 10. Test setting a tag
    console.log('\n10. Setting a new tag...');
    await client.setRegisteredModelTag(renamedBaseName, 'new-tag', 'new-value');
    console.log('Tag set successfully');

    // 11. Test deleting a tag
    console.log('\n11. Deleting a tag...');
    await client.deleteRegisteredModelTag(renamedBaseName, 'new-tag');
    console.log('Tag deleted successfully');

    // 12. Test setting an alias
    console.log('\n12. Setting an alias...');
    await client.setRegisteredModelAlias(renamedBaseName, customAlias, '1');
    console.log('Alias set successfully');

    // 13. Test getting a model version by alias
    console.log('\n13. Getting model version by alias...');
    const aliasedVersion = await client.getModelVersionByAlias(
      renamedBaseName,
      customAlias
    );
    console.log('Aliased version:', aliasedVersion);

    // 14. Test deleting an alias
    console.log('\n14. Deleting an alias...');
    await client.deleteRegisteredModelAlias(renamedBaseName, customAlias);
    console.log('Alias deleted successfully');

    // 15. Test deleting the registered model
    console.log('\n15. Deleting the registered model...');
    await client.deleteRegisteredModel(renamedBaseName);
    console.log('Model deleted successfully');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testModelRegistryClient();
