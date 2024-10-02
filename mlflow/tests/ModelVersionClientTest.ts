import ModelVersionClient from '../src/model-registry/ModelVersionClient';
// import ModelVersionClient from ''
// import ModelVersionClient
// import ModelVersionClient from '../src/model-registry/ModelVersionClient';

async function testModelVersionClient() {
    const client = new ModelVersionClient('http://localhost:5001');
  
    try {
      // Test creating a registered model
      console.log('Creating a new registered model version...');
      const newModelVersion = await client.createModelVersion(
        'test-modelVersion12321',
        "mlflow-artifacts:/784321942139901150/b3457c87f50440388da9d9ddabb1baaa/artifacts/iris_model",
        "b3457c87f50440388da9d9ddabb1baaa"
      );
      console.log('Created model version:', newModelVersion);
  
      // Test getting the registered model
    //   console.log('\nGetting the registered model...');
    //   const retrievedModel = await client.getRegisteredModel('test-model');
    //   console.log('Retrieved model:', retrievedModel);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  testModelVersionClient();