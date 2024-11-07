import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import RunClient from '../src/tracking/RunClient';
import ModelManager from '../src/workflows/ModelManager';
import ModelRegistryClient from '../src/model-registry/ModelRegistryClient';
import ModelVersionClient from '../src/model-registry/ModelVersionClient';

interface keyable {
  [key: string]: any;
}

describe('ModelManager', () => {
  let runClient: RunClient;
  let modelManager: ModelManager;
  let modelRegistryClient: ModelRegistryClient;
  let modelVersionClient: ModelVersionClient;
  let timestamp: number;
  let run: keyable;

  beforeAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    modelRegistryClient = new ModelRegistryClient('http://localhost:5002');
    modelVersionClient = new ModelVersionClient('http://localhost:5002');
    runClient = new RunClient('http://localhost:5002');
    modelManager = new ModelManager('http://localhost:5002');

    timestamp = Date.now();
    run = await runClient.createRun('0'); // Using '0' as the default experiment ID
  });

  describe('createRegisteredModelWithVersion', () => {
    test('Should create a new registered model with a version 1', async () => {
      const modelName2 = `createRegisteredModelWithVersion-test-model-${timestamp}`;
      const newModelVersion: keyable =
        await modelManager.createRegisteredModelWithVersion(
          modelName2,
          run.info.artifact_uri,
          run.info.run_id
        );
      expect(newModelVersion.name).toBe(modelName2);
      expect(newModelVersion.version).toBe('1');
    });
    test('Should throw an error for duplicate model name', async () => {
      // Making it so console.error doesn't show up in the console
      const consoleErrorMock = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => {});
      const modelName3 = `createRegisteredModelWithVersionDup-test-model-${timestamp}`;
      await modelManager.createRegisteredModelWithVersion(
        modelName3,
        run.info.artifact_uri,
        run.info.run_id
      );
      // Testing if an error was thrown
      await expect(
        modelManager.createRegisteredModelWithVersion(
          modelName3,
          run.info.artifact_uri,
          run.info.run_id
        )
      ).rejects.toThrow();
      // testing is a console.error was mocked
      expect(consoleErrorMock).toHaveBeenCalled();
      // restoring the console to show console.error again to not affect other tests
      consoleErrorMock.mockRestore();
    });
    test('Should throw and console.error if no parameters are passed to the method', async () => {
      // Making it so console.error doesn't show up in the console
      const consoleErrorMock = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => {});
      await expect(
        // @ts-expect-error: Trying to 0 parameters when parameters are required
        modelManager.createRegisteredModelWithVersion()
      ).rejects.toThrow();
      // testing is a console.error was mocked
      expect(consoleErrorMock).toHaveBeenCalled();
      // restoring the console to show console.error again to not affect other tests
      consoleErrorMock.mockRestore();
    });
  });

  describe('updateRegisteredModelDescriptionAndTag', () => {
    test("Should update a registered model's description and tag", async () => {
      const modelName2 = `updateRegisteredModelDescriptionAndTag-test-model-${timestamp}`;
      const updateRegisteredModelDescriptionAndTagObject: keyable =
        await modelRegistryClient.createRegisteredModel(modelName2);
      expect(updateRegisteredModelDescriptionAndTagObject.description).toBe(
        undefined
      );
      const updatedModelDescriptionAndTag: keyable =
        await modelManager.updateRegisteredModelDescriptionAndTag(
          modelName2,
          'modelTagKey',
          'modelTagValue',
          'modelDescription'
        );
      expect(updatedModelDescriptionAndTag.description).toBe(
        'modelDescription'
      );
      expect(updatedModelDescriptionAndTag.tags[0].key).toBe('modelTagKey');
      expect(updatedModelDescriptionAndTag.tags[0].value).toBe('modelTagValue');
    });
    test('Should throw and console.error if no parameters are passed to the method', async () => {
      // Making it so console.error doesn't show up in the console
      const consoleErrorMock = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => {});
      await expect(
        // @ts-expect-error: Trying to 0 parameters when parameters are required
        modelManager.updateRegisteredModelDescriptionAndTag()
      ).rejects.toThrow();
      // testing is a console.error was mocked
      expect(consoleErrorMock).toHaveBeenCalled();
      // restoring the console to show console.error again to not affect other tests
      consoleErrorMock.mockRestore();
    });
  });

  describe('updateAllLatestModelVersion', () => {
    test("Should update the latest model version's alias, tag, and description", async () => {
      const modelName2 = `updateAllLatestModelVersion-test-model-${timestamp}`;
      await modelManager.createRegisteredModelWithVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      await modelVersionClient.createModelVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      const updateAllLatestModelVersionObject: keyable =
        await modelManager.updateAllLatestModelVersion(
          modelName2,
          'modelVersionAlias',
          'modelVersionDescription',
          'modelVersionTagKey',
          'modelVersionTagValue'
        );
      expect(updateAllLatestModelVersionObject.version).toBe('2');
      expect(updateAllLatestModelVersionObject.name).toBe(modelName2);
      expect(updateAllLatestModelVersionObject.aliases[0]).toBe(
        'modelVersionAlias'
      );
      expect(updateAllLatestModelVersionObject.description).toBe(
        'modelVersionDescription'
      );
      expect(updateAllLatestModelVersionObject.tags[0].key).toBe(
        'modelVersionTagKey'
      );
      expect(updateAllLatestModelVersionObject.tags[0].value).toBe(
        'modelVersionTagValue'
      );
    });
    test('Should throw and console.error if no parameters are passed to the method', async () => {
      // Making it so console.error doesn't show up in the console
      const consoleErrorMock = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => {});
      await expect(
        // @ts-expect-error: Trying to 0 parameters when parameters are required
        modelManager.updateAllLatestModelVersion()
      ).rejects.toThrow();
      // testing is a console.error was mocked
      expect(consoleErrorMock).toHaveBeenCalled();
      // restoring the console to show console.error again to not affect other tests
      consoleErrorMock.mockRestore();
    });
  });

  describe('setLatestModelVersionTag', () => {
    test('Should add a new tag key/value for the latest version of the specified registered model', async () => {
      const modelName2 = `setLatestModelVersionTag-test-model-${timestamp}`;
      await modelManager.createRegisteredModelWithVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      await modelVersionClient.createModelVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      await modelManager.setLatestModelVersionTag(
        modelName2,
        'modelVersionTagKey',
        'modelVersionTagValue'
      );
      const latestModelVersion: keyable =
        await modelRegistryClient.getLatestModelVersions(modelName2);
      expect(latestModelVersion[0].version).toBe('2');
      expect(latestModelVersion[0].name).toBe(modelName2);
      expect(latestModelVersion[0].tags[0].key).toBe('modelVersionTagKey');
      expect(latestModelVersion[0].tags[0].value).toBe('modelVersionTagValue');
    });
    test('Should throw and console.error if no parameters are passed to the method', async () => {
      // Making it so console.error doesn't show up in the console
      const consoleErrorMock = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => {});
      await expect(
        // @ts-expect-error: Trying to 0 parameters when parameters are required
        modelManager.setLatestModelVersionTag()
      ).rejects.toThrow();
      // testing is a console.error was mocked
      expect(consoleErrorMock).toHaveBeenCalled();
      // restoring the console to show console.error again to not affect other tests
      consoleErrorMock.mockRestore();
    });
  });

  describe('setLatestModelVersionAlias', () => {
    test('Should add an alias for the latest version of the specified registered model', async () => {
      const modelName2 = `setLatestModelVersionAlias-test-model-${timestamp}`;
      await modelManager.createRegisteredModelWithVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      await modelVersionClient.createModelVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      await modelManager.setLatestModelVersionAlias(
        modelName2,
        'modelVersionAlias'
      );
      const latestModelVersion: keyable =
        await modelRegistryClient.getLatestModelVersions(modelName2);
      expect(latestModelVersion[0].version).toBe('2');
      expect(latestModelVersion[0].name).toBe(modelName2);
      expect(latestModelVersion[0].aliases[0]).toBe('modelVersionAlias');
    });
    test('Should throw and console.error if no parameters are passed to the method', async () => {
      // Making it so console.error doesn't show up in the console
      const consoleErrorMock = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => {});
      await expect(
        // @ts-expect-error: Trying to 0 parameters when parameters are required
        modelManager.setLatestModelVersionAlias()
      ).rejects.toThrow();
      // testing is a console.error was mocked
      expect(consoleErrorMock).toHaveBeenCalled();
      // restoring the console to show console.error again to not affect other tests
      consoleErrorMock.mockRestore();
    });
  });

  describe('updateLatestModelVersion', () => {
    test('Should update the description of the latest model version', async () => {
      const modelName2 = `updateLatestModelVersion-test-model-${timestamp}`;
      await modelManager.createRegisteredModelWithVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      await modelVersionClient.createModelVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      const latestModelVersion: keyable =
        await modelManager.updateLatestModelVersion(
          modelName2,
          'modelDescription'
        );
      expect(latestModelVersion.version).toBe('2');
      expect(latestModelVersion.name).toBe(modelName2);
      expect(latestModelVersion.description).toBe('modelDescription');
    });
    test('Should throw and console.error if no parameters are passed to the method', async () => {
      // Making it so console.error doesn't show up in the console
      const consoleErrorMock = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => {});
      await expect(
        // @ts-expect-error: Trying to 0 parameters when parameters are required
        modelManager.updateLatestModelVersion()
      ).rejects.toThrow();
      // testing is a console.error was mocked
      expect(consoleErrorMock).toHaveBeenCalled();
      // restoring the console to show console.error again to not affect other tests
      consoleErrorMock.mockRestore();
    });
  });

  describe('updateAllModelVersion', () => {
    test("Should update the specified version's alias, tag, and description", async () => {
      const modelName2 = `updateAllModelVersion-test-model-${timestamp}`;
      await modelManager.createRegisteredModelWithVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      await modelVersionClient.createModelVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      const updatedModelVersionAll: keyable =
        await modelManager.updateAllModelVersion(
          modelName2,
          '1',
          'modelVersionAlias',
          'modelVersionTagKey',
          'modelVersionTagValue',
          'modelVersionDescription'
        );
      expect(updatedModelVersionAll.version).toBe('1');
      expect(updatedModelVersionAll.name).toBe(modelName2);
      expect(updatedModelVersionAll.tags[0].key).toBe('modelVersionTagKey');
      expect(updatedModelVersionAll.tags[0].value).toBe('modelVersionTagValue');
      expect(updatedModelVersionAll.description).toBe(
        'modelVersionDescription'
      );
    });
    test('Should throw and console.error if no parameters are passed to the method', async () => {
      // Making it so console.error doesn't show up in the console
      const consoleErrorMock = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => {});
      await expect(
        // @ts-expect-error: Trying to 0 parameters when parameters are required
        modelManager.updateAllModelVersion()
      ).rejects.toThrow();
      // testing is a console.error was mocked
      expect(consoleErrorMock).toHaveBeenCalled();
      // restoring the console to show console.error again to not affect other tests
      consoleErrorMock.mockRestore();
    });
  });

  describe('deleteLatestModelVersion', () => {
    test('Should delete the latest version of the model', async () => {
      const modelName2 = `deleteLatestModelVersion-test-model-${timestamp}`;
      await modelManager.createRegisteredModelWithVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      await modelVersionClient.createModelVersion(
        modelName2,
        run.info.artifact_uri,
        run.info.run_id
      );
      await modelManager.deleteLatestModelVersion(modelName2);
      const latestModelVersion: keyable =
        await modelRegistryClient.getLatestModelVersions(modelName2);
      expect(latestModelVersion[0].version).toBe('1');
    });
    test('Should throw and console.error if no parameters are passed to the method', async () => {
      // Making it so console.error doesn't show up in the console
      const consoleErrorMock = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => {});
      await expect(
        // @ts-expect-error: Trying to 0 parameters when parameters are required
        modelManager.deleteLatestModelVersion()
      ).rejects.toThrow();
      // testing is a console.error was mocked
      expect(consoleErrorMock).toHaveBeenCalled();
      // restoring the console to show console.error again to not affect other tests
      consoleErrorMock.mockRestore();
    });
  });

  describe('createModelFromRunWithBestMetric', () => {
    test('Should create model from run with best(highest) metric', async () => {
      const run2: keyable = await runClient.createRun('0'); // Using '0' as the default experiment ID
      await runClient.logMetric(run.info.run_id, 'runMetricKey', 2);
      await runClient.logMetric(run2.info.run_id, 'runMetricKey', 1);

      const runData: keyable = await runClient.getRun(run.info.run_id);

      const modelName2 = `createModelFromRunWithBestMetric-test-modelMax-${timestamp}`;
      await modelManager.createModelFromRunWithBestMetric(
        [run.info.experiment_id],
        runData.data.metrics[0].key,
        'max',
        modelName2
      );
      const maxModel: keyable = await modelRegistryClient.getRegisteredModel(
        modelName2
      );
      expect(maxModel.latest_versions[0].source).toBe(
        runData.info.artifact_uri
      );
    });

    test('Should create model from run with best(minimum) metric', async () => {
      const run2: keyable = await runClient.createRun('0'); // Using '0' as the default experiment ID
      await runClient.logMetric(run.info.run_id, 'runMetricKey', 2);
      await runClient.logMetric(run2.info.run_id, 'runMetricKey', 1);

      const runData2: keyable = await runClient.getRun(run2.info.run_id);

      const modelName2 = `createModelFromRunWithBestMetric-test-modelMin-${timestamp}`;
      await modelManager.createModelFromRunWithBestMetric(
        [run2.info.experiment_id],
        runData2.data.metrics[0].key,
        'min',
        modelName2
      );
      const minModel: keyable = await modelRegistryClient.getRegisteredModel(
        modelName2
      );
      expect(minModel.latest_versions[0].source).toBe(
        runData2.info.artifact_uri
      );
    });

    test('Should throw and console.error if no parameters are passed to the method', async () => {
      // Making it so console.error doesn't show up in the console
      const consoleErrorMock = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => {});
      await expect(
        // @ts-expect-error: Trying to 0 parameters when parameters are required
        modelManager.createModelFromRunWithBestMetric()
      ).rejects.toThrow();
      // testing is a console.error was mocked
      expect(consoleErrorMock).toHaveBeenCalled();
      // restoring the console to show console.error again to not affect other tests
      consoleErrorMock.mockRestore();
    });
  });
});