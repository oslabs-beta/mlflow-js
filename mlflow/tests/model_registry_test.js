// import ModelRegistry from '../src/model-registry/model_registry.js';
import ModelRegistryClient from '../lib/model-registry/ModelRegistryClient.js';

/** issue:
 * need to manually add .js extension in the complied ModelRegistryClient.js file
 */

async function main() {
  const trackingUri = 'http://localhost:5001';
  // const modelRegistry = new ModelRegistry(trackingUri);
  const modelRegistry = new ModelRegistryClient(trackingUri);

  try {
    // Create a new registered model
    const createdModel = await modelRegistry.createRegisteredModel(
      'MyModel1',
      [{ key: 'framework', value: 'pytorch' }],
      'My first registered model'
    );
    console.log('Created model:', createdModel);

    // // Get the registered model
    // const retrievedModel = await modelRegistry.getRegisteredModel(
    //   'sk-learn-random-forest-reg-model'
    // );
    // console.log('Retrieved model:', retrievedModel);

    // // Rename the registered model
    // const renamedModel = await modelRegistry.renameRegisteredModel(
    //   'MyModel6',
    //   'MyModel6New'
    // );
    // console.log('Renamed model:', renamedModel);

    // // Update the model description
    // const updatedModel = await modelRegistry.updateRegisteredModel(
    //   'sk-learn-random-forest-reg-model',
    //   'From tutorial sklearn'
    // );
    // console.log('Updated model:', updatedModel);

    // // Get latest model versions
    // const latestVersions = await modelRegistry.getLatestModelVersions(
    //   'sk-learn-random-forest-reg-model'
    // );
    // console.log('Latest versions:', latestVersions);

    // // Set a tag on the model
    // await modelRegistry.setRegisteredModelTag(
    //   'sk-learn-random-forest-reg-model',
    //   'key1',
    //   'value1'
    // );
    // console.log('Tag set successfully');

    // // Search for models
    // const searchResults = await modelRegistry.searchRegisteredModels(
    //   "name LIKE 'My%'",
    //   10,
    //   ['name ASC'],
    //   null
    // );
    // console.log('Search results:', searchResults);

    // // Delete a tag from the model
    // await modelRegistry.deleteRegisteredModelTag('MyNewModel', 'model_type');
    // console.log('Tag deleted successfully');

    // Delete the model
    // await modelRegistry.deleteRegisteredModel('MyModel5New');
    // console.log('Model deleted successfully');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
