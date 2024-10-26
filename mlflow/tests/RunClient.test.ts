import { describe, test, expect, beforeAll } from '@jest/globals';
import RunClient from '../src/tracking/RunClient';
import ExperimentClient from '../src/tracking/ExperimentClient';
import { Run } from '../src/utils/interface';
import { ApiError } from '../src/utils/apiError';

describe('RunClient', () => {
  let runClient: RunClient;
  let experimentClient: ExperimentClient;
  let experimentId: string;

  beforeAll(async () => {
    // Add a small delay to ensure MLflow is fully ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
    runClient = new RunClient('http://127.0.0.1:5001');
    experimentClient = new ExperimentClient('http://127.0.0.1:5001');

    // Generate the experiment ID for test runs
    const timestamp = Date.now();
    experimentId = await experimentClient.createExperiment(
      `Testing ${timestamp}`
    );
  });

  describe('createRun', () => {
    // POST - Create a new run within an experiment
    test('- Should create a run with experiment_id', async () => {
      const response = (await runClient.createRun(experimentId)) as Run;

      expect(response.info.experiment_id).toBe(experimentId);
    });

    test('- Should create a run with optional run_name', async () => {
      const run_name = 'Test Run 1';

      const response = (await runClient.createRun(
        experimentId,
        run_name
      )) as Run;

      expect(response.info.run_name).toBe(run_name);
      expect(response.data.tags).toContainEqual({
        key: 'mlflow.runName',
        value: run_name,
      });
    });

    test('- Should create a run with optional tags', async () => {
      const tags = [
        { key: 'test_key1', value: 'test_value1' },
        { key: 'test_key2', value: 'test_value2' },
      ];

      const response = (await runClient.createRun(
        experimentId,
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
      const run_name = 'Test Run 2';
      const start_time = Date.now();
      const tags = [{ key: 'test_key', value: 'test_value' }];

      const response = (await runClient.createRun(
        experimentId,
        run_name,
        start_time,
        tags
      )) as Run;

      expect(response.info.experiment_id).toBe(experimentId);
      expect(response.info.run_name).toBe(run_name);
      expect(response.info.start_time).toBe(start_time);
      expect(response.data.tags).toContainEqual(tags[0]);
    });

    test('- Should throw errors if experiment_id is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.createRun()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.createRun()).rejects.toThrow(
        /Error creating run:/
      );
    });

    test('- Should handle API errors', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.createRun(invalid_id)).rejects.toThrow(ApiError);

      // the thrown error message with invalid_id somewhere in the message
      await expect(runClient.createRun(invalid_id)).rejects.toThrow(
        /Error creating run:.+invalid_id/
      );
    });
  });
});
