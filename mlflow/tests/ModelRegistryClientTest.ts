import ModelRegistryClient from '../src/model_registry/ModelRegistryClient';

async function testModelRegistryClient() {
  const client = new ModelRegistryClient('http://localhost:5001');

  try {
    // Test creating a registered model
    console.log('Creating a new registered model...');
    const newModel = await client.createRegisteredModel(
      'test-model',
      [{ key: 'test-tag', value: 'test-value' }],
      'This is a test model'
    );
    console.log('Created model:', newModel);

    // Test getting the registered model
    console.log('\nGetting the registered model...');
    const retrievedModel = await client.getRegisteredModel('test-model');
    console.log('Retrieved model:', retrievedModel);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testModelRegistryClient();
