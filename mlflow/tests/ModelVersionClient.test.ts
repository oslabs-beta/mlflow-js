import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import ModelVersionClient from '../src/model-registry/ModelVersionClient';
import ModelRegistryClient from '../src/model-registry/ModelRegistryClient';
import RunClient from '../src/tracking/RunClient';
// import {
//   Run,
//   Metrics,
//   Params,
//   Tags,
//   MetricHistoryResponse,
// } from '../src/utils/interface';

// interface keyable {
//   [key: string]: any;
// }

describe('ModelVersionClient', () => {
  let modelVersionClient: ModelVersionClient;
  let modelRegistryClient: ModelRegistryClient;
  let runClient: RunClient;
  let run: object;

  beforeAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    modelRegistryClient = new ModelRegistryClient('http://localhost:5002');
    modelVersionClient = new ModelVersionClient('http://localhost:5002');
    runClient = new RunClient('http://localhost:5002');

    const timestamp = Date.now();
    const modelName = `test-model-${timestamp}`;
    // Creating a new registered model to test on
    await modelRegistryClient.createRegisteredModel(
      modelName,
      [{ key: 'test-tag', value: 'test-value' }],
      'This is a test model'
    );

    console.log('\n5. Creating a run...');
    const run = (await runClient.createRun('0')); // Using '0' as the default experiment ID
    // console.log('Created run:', run);
  });

  describe('createModelVersion', () => {
    test('Should create a new model version', async () => {
      const createdModelVersion = await modelVersionClient.createModelVersion(
        modelName,
        run.info.artifact_uri,
        run.info.run_id,
        [{ key: 'test-tag', value: 'test-value' }]
      );
    });
  });
});
