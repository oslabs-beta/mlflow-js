import { describe, test, expect, beforeAll } from '@jest/globals';
import RunClient from '../src/tracking/RunClient';
import ExperimentClient from '../src/tracking/ExperimentClient';
import { ApiError } from '../src/utils/apiError';
import { Run } from '../src/utils/interface';
import { Metric } from '../src/utils/interface';

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
      const run = (await runClient.createRun(experimentId)) as Run;

      expect(run.info.experiment_id).toBe(experimentId);
    });

    test('- Should create a run with optional run_name', async () => {
      const run_name = 'Test Run 1';

      const run = (await runClient.createRun(experimentId, run_name)) as Run;

      expect(run.info.run_name).toBe(run_name);
      expect(run.data.tags).toContainEqual({
        key: 'mlflow.runName',
        value: run_name,
      });
    });

    test('- Should create a run with optional tags', async () => {
      const tags = [
        { key: 'test_key1', value: 'test_value1' },
        { key: 'test_key2', value: 'test_value2' },
      ];

      const run = (await runClient.createRun(
        experimentId,
        undefined,
        undefined,
        tags
      )) as Run;

      expect(run.data).toHaveProperty('tags');
      tags.forEach((tag) => {
        expect(run.data.tags).toContainEqual(tag);
      });
    });

    test('- Should create a run with all parameters', async () => {
      const run_name = 'Test Run 2';
      const start_time = Date.now();
      const tags = [{ key: 'test_key', value: 'test_value' }];

      const run = (await runClient.createRun(
        experimentId,
        run_name,
        start_time,
        tags
      )) as Run;

      expect(run.info.experiment_id).toBe(experimentId);
      expect(run.info.run_name).toBe(run_name);
      expect(run.info.start_time).toBe(start_time);
      expect(run.data.tags).toContainEqual(tags[0]);
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

  describe('deleteRun', () => {
    // DELETE - Mark a run for deletion
    test('- Should delete a run with run_id', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      await expect(runClient.deleteRun(run.info.run_id)).resolves.not.toThrow();

      // check if the run's lifecycle_stage has changed to "deleted"
      const deletedRun = (await runClient.getRun(run.info.run_id)) as Run;
      expect(deletedRun.info.lifecycle_stage).toBe('deleted');
    });

    test('- Should throw errors if run_id is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.deleteRun()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.deleteRun()).rejects.toThrow(
        /Error deleting run:/
      );
    });

    test('- Should handle API errors', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.deleteRun(invalid_id)).rejects.toThrow(ApiError);

      // the thrown error message with invalid_id somewhere in the message
      await expect(runClient.deleteRun(invalid_id)).rejects.toThrow(
        /Error deleting run:.+invalid_id/
      );
    });
  });

  describe('restoreRun', () => {
    // POST - Restore a deleted run
    test('- Should restore a deleted run with run_id', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;
      await runClient.deleteRun(run.info.run_id);

      // check if the run is marked as deleted
      const deletedRun = (await runClient.getRun(run.info.run_id)) as Run;
      expect(deletedRun.info.lifecycle_stage).toBe('deleted');

      // restore the run
      await expect(
        runClient.restoreRun(run.info.run_id)
      ).resolves.not.toThrow();

      // check if the run is restored and no longer marked as deleted
      const restoredRun = (await runClient.getRun(run.info.run_id)) as Run;
      expect(restoredRun.info.lifecycle_stage).not.toBe('deleted');
    });

    test('- Should not throw error when trying to restore a non-deleted run', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      // Attempt to restore a non-deleted run
      await expect(
        runClient.restoreRun(run.info.run_id)
      ).resolves.not.toThrow();

      // Verify that the run's lifecycle stage hasn't changed
      const unchangedRun = (await runClient.getRun(run.info.run_id)) as Run;
      expect(unchangedRun.info.lifecycle_stage).not.toBe('deleted');
    });

    test('- Should throw errors if run_id is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.restoreRun()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.restoreRun()).rejects.toThrow(
        /Error restoring run:/
      );
    });

    test('- Should handle API errors', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.restoreRun(invalid_id)).rejects.toThrow(ApiError);

      // the thrown error message with invalid_id somewhere in the message
      await expect(runClient.restoreRun(invalid_id)).rejects.toThrow(
        /Error restoring run:.+invalid_id/
      );
    });
  });

  describe('getRun', () => {
    // GET - Get metadata, metrics, params, and tags for a run
    test('- Should retrieve metadata for a run with run_id', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      // create dummy data for created run
      const metrics: Metric[] = [
        { key: 'accuracy', value: 0.83, timestamp: 1694000700000 },
        { key: 'loss', value: 0.18, timestamp: 1694000700000 },
      ];
      const params = [
        { key: 'learning_rate', value: '0.0001' },
        { key: 'batch_size', value: '256' },
      ];
      const tags = [
        { key: 'model_type', value: 'GradientBoosting' },
        { key: 'data_version', value: 'v1.7' },
      ];
      await runClient.logBatch(run.info.run_id, metrics, params, tags);

      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

      // check metrics
      const fetchedMetrics = fetchedRun.data.metrics as Metric[];

      expect(fetchedMetrics).toHaveLength(metrics.length);

      metrics.forEach((metric) => {
        const fetchedMetric = fetchedMetrics.find((m) => m.key === metric.key);
        expect(fetchedMetric).toBeDefined();

        if (fetchedMetric) {
          expect(fetchedMetric.value).toBe(metric.value);
          expect(fetchedMetric.timestamp).toBe(metric.timestamp);
          expect(fetchedMetric).toHaveProperty('step');
        }
      });

      // check params
      expect(fetchedRun.data.params).toEqual(expect.arrayContaining(params));

      // check tags
      expect(fetchedRun.data.tags).toEqual(expect.arrayContaining(tags));
    });

    test('- Should throw errors if run_id is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.getRun()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.getRun()).rejects.toThrow(/Error fetching run:/);
    });

    test('- Should handle API errors', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.getRun(invalid_id)).rejects.toThrow(ApiError);

      // the thrown error message with invalid_id somewhere in the message
      await expect(runClient.getRun(invalid_id)).rejects.toThrow(
        /Error fetching run:.+invalid_id/
      );
    });
  });

  describe('updateRun', () => {
    // POST - Update run metadata

    // parameterized testing for input status
    const allStatuses = [
      'RUNNING',
      'SCHEDULED',
      'FINISHED',
      'FAILED',
      'KILLED',
    ] as const;

    test.each(allStatuses)(
      '- Should handle %s status correctly',
      async (status) => {
        const run = (await runClient.createRun(experimentId)) as Run;
        await runClient.updateRun(run.info.run_id, status);
        const updatedRun = (await runClient.getRun(run.info.run_id)) as Run;
        expect(updatedRun.info.status).toBe(status);
      }
    );

    test('- Should resolve invalid status with "RUNNING"', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const updatedRun = (await runClient.updateRun(
        run.info.run_id,
        'INVALID_STATUS' as any
      )) as Run;

      expect(updatedRun).toBeDefined();

      if ('info' in updatedRun) {
        expect(updatedRun.info.status).toBe('RUNNING');
      }
    });

    test('- Should not throw error when only pass in the run_id', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const updatedRun = await runClient.updateRun(run.info.run_id);
      expect(updatedRun).toBeDefined();
    });

    test('- Should updateRun with all parameters', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const status = 'FINISHED';
      const end_time = 1994000700000;
      const run_name = 'Updated Run';

      const updatedRun = (await runClient.updateRun(
        run.info.run_id,
        status,
        end_time,
        run_name
      )) as Run;

      expect(updatedRun).toBeDefined();

      if ('info' in updatedRun) {
        expect(updatedRun.info.run_name).toBe(run_name);
        expect(updatedRun.info.status).toBe(status);
        expect(updatedRun.info.end_time).toBe(end_time);
      } else {
        console.log('Unexpected updatedRun structure:', updatedRun);
      }

      // fetch the run again to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

      console.log(fetchedRun.info);
      console.log(fetchedRun.data);
      console.log(fetchedRun.inputs);

      expect(fetchedRun.info.run_name).toBe(run_name);
      expect(fetchedRun.info.status).toBe(status);
      expect(fetchedRun.info.end_time).toBe(end_time);

      if (run_name) {
        const runNameTag = fetchedRun.data.tags.find(
          (tag) => tag.key === 'mlflow.runName'
        );
        expect(runNameTag).toBeDefined();
        expect(runNameTag?.value).toBe(run_name);
      }
    });

    test('- Should throw errors if run_id is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.updateRun()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.updateRun()).rejects.toThrow(
        /Error updating run:/
      );
    });

    test('- Should handle API errors', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.updateRun(invalid_id)).rejects.toThrow(ApiError);

      // the thrown error message with invalid_id somewhere in the message
      await expect(runClient.updateRun(invalid_id)).rejects.toThrow(
        /Error updating run:.+invalid_id/
      );
    });
  });
});
