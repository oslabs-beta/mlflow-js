import { describe, test, expect, beforeAll } from '@jest/globals';
import RunClient from '../src/tracking/RunClient';
import { Run } from '../src/utils/interface';
import { ApiError } from '../src/utils/apiError';

describe('RunClient', () => {
  let client: RunClient;

  beforeAll(async () => {
    // Add a small delay to ensure MLflow is fully ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
    client = new RunClient('http://127.0.0.1:5001');
  });

  describe('createRun', () => {
    // POST - Create a new run within an experiment
    test('- Should create a run with experiment_id', async () => {
      const experiment_id = '876374673578277025';

      const response = (await client.createRun(experiment_id)) as Run;

      expect(response.info.experiment_id).toBe(experiment_id);
    });

    test('- Should create a run with optional run_name', async () => {
      const experiment_id = '876374673578277025';
      const run_name = 'Test Run 1';

      const response = (await client.createRun(experiment_id, run_name)) as Run;

      expect(response.info.run_name).toBe(run_name);
      expect(response.data.tags).toContainEqual({
        key: 'mlflow.runName',
        value: run_name,
      });
    });

    test('- Should create a run with optional tags', async () => {
      const experiment_id = '876374673578277025';
      const tags = [
        { key: 'test_key1', value: 'test_value1' },
        { key: 'test_key2', value: 'test_value2' },
      ];

      const response = (await client.createRun(
        experiment_id,
        undefined,
        undefined,
        tags
      )) as Run;

      expect(response.data).toHaveProperty('tags');
      tags.forEach((tag) => {
        expect(response.data.tags).toContainEqual(tag);
      });
    });

    test('- Should create a run with all parameters', async () => {
      const experiment_id = '876374673578277025';
      const run_name = 'Test Run 2';
      const start_time = Date.now();
      const tags = [{ key: 'test_key', value: 'test_value' }];

      const response = (await client.createRun(
        experiment_id,
        run_name,
        start_time,
        tags
      )) as Run;

      expect(response.info.experiment_id).toBe(experiment_id);
      expect(response.info.run_name).toBe(run_name);
      expect(response.info.start_time).toBe(start_time);
      expect(response.data.tags).toContainEqual(tags[0]);
    });

    test('- Should handle API errors', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(client.createRun(invalid_id)).rejects.toThrow(ApiError);

      // the thrown error message with invalid_id somewhere in the message
      await expect(client.createRun(invalid_id)).rejects.toThrow(
        /Error creating run:.+invalid_id/
      );
    });
  });
});
