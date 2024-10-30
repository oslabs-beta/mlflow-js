import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import ModelRegistryClient from '../src/model-registry/ModelRegistryClient';
import ModelVersionClient from '../src/model-registry/ModelVersionClient';
import RunClient from '../src/tracking/RunClient';

interface keyable {
  [key: string]: any;
}

describe('ModelRegistryClient Integration Tests', () => {
  let modelRegistryClient: ModelRegistryClient;
  let modelVersionClient: ModelVersionClient;
  let runClient: RunClient;
  let modelName: string;
  let runId: string;
  let artifactUri: string;

  beforeAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    modelRegistryClient = new ModelRegistryClient('http://localhost:5002');
    modelVersionClient = new ModelVersionClient('http://localhost:5002');
    runClient = new RunClient('http://localhost:5002');

    const run = (await runClient.createRun('0')) as keyable;
    runId = run.info.run_id;
    artifactUri = `${run.info.artifact_uri}/model`;
  });

  beforeEach(() => {
    modelName = `test_model_${Date.now()}`;
  });

  describe('createRegisteredModel', () => {
    test('should create a model with required name only', async () => {
      const response = (await modelRegistryClient.createRegisteredModel(
        modelName
      )) as keyable;

      expect(response.name).toBe(modelName);
    });

    test('should throw error for duplicate model name', async () => {
      await modelRegistryClient.createRegisteredModel(modelName);

      await expect(
        modelRegistryClient.createRegisteredModel(modelName)
      ).rejects.toThrow('already exists');
    });
  });

  describe('getRegisteredModel', () => {
    test('should get existing model', async () => {
      await modelRegistryClient.createRegisteredModel(modelName);

      const response = (await modelRegistryClient.getRegisteredModel(
        modelName
      )) as keyable;

      expect(response.name).toBe(modelName);
    });

    test('should throw error for non-existent model', async () => {
      await expect(
        modelRegistryClient.getRegisteredModel('non_existent_model')
      ).rejects.toThrow('not found');
    });
  });

  describe('updateRegisteredModel', () => {
    test('should update model description', async () => {
      await modelRegistryClient.createRegisteredModel(modelName);
      const newDescription = 'Updated description';

      const response = (await modelRegistryClient.updateRegisteredModel(
        modelName,
        newDescription
      )) as keyable;

      expect(response.description).toBe(newDescription);
    });

    test('should throw error for non-existent model', async () => {
      await expect(
        modelRegistryClient.updateRegisteredModel(
          'non_existent_model',
          'description'
        )
      ).rejects.toThrow('not found');
    });
  });

  describe('renameRegisteredModel', () => {
    test('should rename model successfully', async () => {
      await modelRegistryClient.createRegisteredModel(modelName);
      const newName = `${modelName}_renamed`;

      const response = (await modelRegistryClient.renameRegisteredModel(
        modelName,
        newName
      )) as keyable;

      expect(response.name).toBe(newName);
    });

    test('should throw error when renaming to existing name', async () => {
      const existingName = `${modelName}_existing`;
      await modelRegistryClient.createRegisteredModel(modelName);
      await modelRegistryClient.createRegisteredModel(existingName);

      await expect(
        modelRegistryClient.renameRegisteredModel(modelName, existingName)
      ).rejects.toThrow('already exists');
    });
  });

  describe('getLatestModelVersions', () => {
    test('should get latest versions of model', async () => {
      await modelRegistryClient.createRegisteredModel(modelName);
      await modelVersionClient.createModelVersion(
        modelName,
        artifactUri,
        runId
      );

      const response = await modelRegistryClient.getLatestModelVersions(
        modelName
      );
      expect(response).toBeDefined();
    });
  });

  describe('searchRegisteredModels', () => {
    test('should search models with max_results', async () => {
      await modelRegistryClient.createRegisteredModel(modelName);

      const response = (await modelRegistryClient.searchRegisteredModels(
        `name LIKE '${modelName}%'`,
        1
      )) as keyable;

      expect(response.registered_models).toBeDefined();
    });

    test('should search with order_by', async () => {
      await modelRegistryClient.createRegisteredModel(modelName);

      const response = (await modelRegistryClient.searchRegisteredModels(
        `name LIKE '${modelName}%'`,
        1,
        ['name ASC']
      )) as keyable;

      expect(response.registered_models).toBeDefined();
    });
  });

  describe('model tags', () => {
    test('should set and delete tag', async () => {
      await modelRegistryClient.createRegisteredModel(modelName);
      const tagKey = 'test_tag';
      const tagValue = 'test_value';

      await modelRegistryClient.setRegisteredModelTag(
        modelName,
        tagKey,
        tagValue
      );

      const model = (await modelRegistryClient.getRegisteredModel(
        modelName
      )) as keyable;

      expect(model.tags?.[0]?.key).toBe(tagKey);
      expect(model.tags?.[0]?.value).toBe(tagValue);

      await modelRegistryClient.deleteRegisteredModelTag(modelName, tagKey);

      const updatedModel = (await modelRegistryClient.getRegisteredModel(
        modelName
      )) as keyable;
      expect(updatedModel.tags?.length || 0).toBe(0);
    });
  });

  describe('model aliases', () => {
    test('should set, get, and delete alias', async () => {
      await modelRegistryClient.createRegisteredModel(modelName);
      const version = (await modelVersionClient.createModelVersion(
        modelName,
        artifactUri,
        runId
      )) as keyable;

      const alias = 'production';
      await modelRegistryClient.setRegisteredModelAlias(
        modelName,
        alias,
        version.version
      );

      const modelVersion = (await modelRegistryClient.getModelVersionByAlias(
        modelName,
        alias
      )) as keyable;
      expect(modelVersion.version).toBe(version.version);

      await modelRegistryClient.deleteRegisteredModelAlias(modelName, alias);

      await expect(
        modelRegistryClient.getModelVersionByAlias(modelName, alias)
      ).rejects.toThrow();
    });

    test('should throw error for non-existent model alias', async () => {
      await modelRegistryClient.createRegisteredModel(modelName);
      await expect(
        modelRegistryClient.getModelVersionByAlias(
          modelName,
          'non_existent_alias'
        )
      ).rejects.toThrow();
    });
  });

  describe('deleteRegisteredModel', () => {
    test('should delete model', async () => {
      await modelRegistryClient.createRegisteredModel(modelName);
      await modelRegistryClient.deleteRegisteredModel(modelName);

      await expect(
        modelRegistryClient.getRegisteredModel(modelName)
      ).rejects.toThrow('not found');
    });

    test('should throw error for non-existent model', async () => {
      await expect(
        modelRegistryClient.deleteRegisteredModel('non_existent_model')
      ).rejects.toThrow('not found');
    });
  });
});
