import { describe, test, expect, beforeAll } from '@jest/globals';
import RunClient from '../src/tracking/RunClient';
import ExperimentClient from '../src/tracking/ExperimentClient';
import { ApiError } from '../src/utils/apiError';
import { Run } from '../src/utils/interface';
import { Metric, Params, Tags } from '../src/utils/interface';

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

  // POST - Create a new run within an experiment
  describe('createRun', () => {
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

    test('- Should throw error if experiment_id is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.createRun()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.createRun()).rejects.toThrow(
        /Error creating run:/
      );
    });

    test('- Should handle API error', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.createRun(invalid_id)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error creating run:.+invalid_id/),
        })
      );
    });
  });

  // DELETE - Mark a run for deletion
  describe('deleteRun', () => {
    test('- Should delete a run with run_id', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      await expect(runClient.deleteRun(run.info.run_id)).resolves.not.toThrow();

      // check if the run's lifecycle_stage has changed to "deleted"
      const deletedRun = (await runClient.getRun(run.info.run_id)) as Run;
      expect(deletedRun.info.lifecycle_stage).toBe('deleted');
    });

    test('- Should throw error if run_id is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.deleteRun()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.deleteRun()).rejects.toThrow(
        /Error deleting run:/
      );
    });

    test('- Should handle API error', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.deleteRun(invalid_id)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error deleting run:.+invalid_id/),
        })
      );
    });
  });

  // POST - Restore a deleted run
  describe('restoreRun', () => {
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

    test('- Should throw error if run_id is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.restoreRun()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.restoreRun()).rejects.toThrow(
        /Error restoring run:/
      );
    });

    test('- Should handle API error', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.restoreRun(invalid_id)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error restoring run:.+invalid_id/),
        })
      );
    });
  });

  // GET - Get metadata, metrics, params, and tags for a run
  describe('getRun', () => {
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

    test('- Should throw error if run_id is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.getRun()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.getRun()).rejects.toThrow(/Error fetching run:/);
    });

    test('- Should handle API error', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.getRun(invalid_id)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error fetching run:.+invalid_id/),
        })
      );
    });
  });

  // POST - Update run metadata
  describe('updateRun', () => {
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

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

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

    test('- Should throw error if run_id is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.updateRun()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.updateRun()).rejects.toThrow(
        /Error updating run:/
      );
    });

    test('- Should handle API error', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.updateRun(invalid_id)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error updating run:.+invalid_id/),
        })
      );
    });
  });

  // POST - Log a metric for a run
  describe('logMetric', () => {
    test('- Should log a metric with run_id, key, value, and timestamp', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const key = 'accuracy';
      const value = 0.9;
      const timestamp = Date.now();

      await expect(
        runClient.logMetric(run.info.run_id, key, value, timestamp)
      ).resolves.not.toThrow();

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

      expect(fetchedRun.info.run_id).toBe(run.info.run_id);
      expect(fetchedRun.data.metrics).toBeDefined();
      expect(Array.isArray(fetchedRun.data.metrics)).toBe(true);

      expect(fetchedRun.data.metrics).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: key,
            value: value,
            timestamp: expect.any(Number),
            step: expect.any(Number),
          }),
        ])
      );

      const runTag = fetchedRun.data.tags?.find(
        (tag) => tag.key === 'mlflow.runName'
      );

      expect(runTag?.key).toBe('mlflow.runName');
      expect(runTag?.value).toBe(run.info.run_name);
    });

    test('- Should throw error if required arguments are missing', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const key = 'accuracy';
      const value = 0.9;

      // @ts-expect-error: testing for all missing arguments
      await expect(runClient.logMetric()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing key and value
      await expect(runClient.logMetric(run.info.run_id)).rejects.toThrow(
        ApiError
      );
      // @ts-expect-error: testing for all missing value
      await expect(runClient.logMetric(run.info.run_id, key)).rejects.toThrow(
        ApiError
      );
      // All required args provided, should not throw
      await expect(
        runClient.logMetric(run.info.run_id, key, value)
      ).resolves.not.toThrow();
    });

    test('- Should handle API error', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const invalid_id = 'invalid_id';
      const key = 'accuracy';
      const value = 0.9;

      // the thrown error is specifically an instance of 'ApiError'
      // test with invalid run_id
      await expect(runClient.logMetric(invalid_id, key, value)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error logging metric:.+invalid_id/),
        })
      );

      // test with valid run_id but invalid key
      await expect(
        runClient.logMetric(run.info.run_id, '', value)
      ).rejects.toThrow(ApiError);

      // test with valid run_id but invalid value
      await expect(
        runClient.logMetric(run.info.run_id, key, NaN)
      ).rejects.toThrow(ApiError);
    });
  });

  // POST - Log a batch of metrics, params, and tags for a run
  describe('logBatch', () => {
    test('- Should not throw error with just run_id', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      await expect(
        runClient.logBatch(run.info.run_id)
      ).resolves.toBeUndefined();
    });

    test('- Should log batch with optional metrics', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const metrics: Metric[] = [
        { key: 'accuracy', value: 0.83, timestamp: 1694000700000 },
        { key: 'loss', value: 0.18, timestamp: 1694000700000 },
      ];

      await runClient.logBatch(run.info.run_id, metrics);

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

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

        const runTag = fetchedRun.data.tags?.find(
          (tag) => tag.key === 'mlflow.runName'
        );

        expect(runTag?.key).toBe('mlflow.runName');
        expect(runTag?.value).toBe(run.info.run_name);
      });
    });

    test('- Should log batch with optional params', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const params: Params[] = [
        { key: 'learning_rate', value: '0.0001' },
        { key: 'batch_size', value: '256' },
      ];

      await runClient.logBatch(run.info.run_id, undefined, params);

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

      expect(fetchedRun.data.params).toEqual(expect.arrayContaining(params));
    });

    test('- Should log batch with optional tags', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const tags: Tags[] = [
        { key: 'model_type', value: 'GradientBoosting' },
        { key: 'data_version', value: 'v1.7' },
      ];

      await runClient.logBatch(run.info.run_id, undefined, undefined, tags);

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

      expect(fetchedRun.data.tags).toEqual(expect.arrayContaining(tags));
    });

    test('- Should be able to log up to 1000 metrics', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const metrics = Array.from({ length: 1000 }, (_, index) => ({
        key: `metric${index}`,
        value: index,
        timestamp: Date.now(),
        step: index,
      }));

      await expect(
        runClient.logBatch(run.info.run_id, metrics)
      ).resolves.toBeUndefined();
    });

    test('- Should throw error when exceeding 1000 metrics', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const metrics = Array.from({ length: 1001 }, (_, index) => ({
        key: `metric${index}`,
        value: index,
        timestamp: Date.now(),
        step: index,
      }));

      await expect(
        runClient.logBatch(run.info.run_id, metrics)
      ).rejects.toThrow(ApiError);
    });

    test('- Should be able to log up to 100 params', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const params = Array.from({ length: 100 }, (_, index) => ({
        key: `param${index}`,
        value: `value${index}`,
      }));

      await expect(
        runClient.logBatch(run.info.run_id, undefined, params)
      ).resolves.toBeUndefined();
    });

    test('- Should throw error when exceeding 100 params', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const params = Array.from({ length: 101 }, (_, index) => ({
        key: `param${index}`,
        value: `value${index}`,
      }));

      await expect(
        runClient.logBatch(run.info.run_id, undefined, params)
      ).rejects.toThrow(ApiError);
    });

    test('- Should be able to log up to 100 tags', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const tags = Array.from({ length: 100 }, (_, index) => ({
        key: `tag${index}`,
        value: `value${index}`,
      }));

      await expect(
        runClient.logBatch(run.info.run_id, undefined, undefined, tags)
      ).resolves.toBeUndefined();
    });

    test('- Should throw error when exceeding 100 tags', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const tags = Array.from({ length: 101 }, (_, index) => ({
        key: `tag${index}`,
        value: `value${index}`,
      }));

      await expect(
        runClient.logBatch(run.info.run_id, undefined, undefined, tags)
      ).rejects.toThrow(ApiError);
    });

    test('- Should throw error if run_id is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.logBatch()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.logBatch()).rejects.toThrow(
        /Error logging batch:/
      );
    });

    test('- Should handle API error', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.logBatch(invalid_id)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error logging batch:.+invalid_id/),
        })
      );
    });
  });

  // POST - Logs a model
  describe('logModel', () => {
    test('- Should log a model with run_id and model_json', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const model = {
        artifact_path: 'pytorch_dnn',
        flavors: {
          python_function: {
            env: 'conda.yaml',
            loader_module: 'mlflow.pytorch',
            model_path: 'model.pth',
            python_version: '3.8.10',
          },
          pytorch: {
            model_data: 'model.pth',
            pytorch_version: '1.9.0',
            code: 'model-code',
          },
        },
        utc_time_created: '2023-09-14 10:15:00.000000',
        run_id: run.info.run_id,
      };

      const model_json = JSON.stringify(model);

      await expect(
        runClient.logModel(run.info.run_id, model_json)
      ).resolves.toBeUndefined();

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

      // check mlflow.runName tag
      const runNameTag = fetchedRun.data.tags?.find(
        (tag) => tag.key === 'mlflow.runName'
      );

      expect(runNameTag?.key).toBe('mlflow.runName');
      expect(runNameTag?.value).toBe(run.info.run_name);

      // check mlflow.log-model.history ttag
      const logModelHistoryTag = fetchedRun.data.tags?.find(
        (tag) => tag.key === 'mlflow.log-model.history'
      );

      expect(logModelHistoryTag?.key).toBe('mlflow.log-model.history');

      const loggedModelHistory = JSON.parse(logModelHistoryTag?.value || '[]');

      expect(loggedModelHistory.length).toBeGreaterThan(0);

      const loggedModel = loggedModelHistory[0];
      expect(loggedModel.run_id).toBe(run.info.run_id);
      expect(loggedModel.artifact_path).toBe(model.artifact_path);
      expect(loggedModel.utc_time_created).toBe(model.utc_time_created);

      expect(loggedModel.flavors).toEqual(
        expect.objectContaining({
          python_function: expect.objectContaining({
            env: 'conda.yaml',
            loader_module: 'mlflow.pytorch',
            model_path: 'model.pth',
            python_version: '3.8.10',
          }),
          pytorch: expect.objectContaining({
            model_data: 'model.pth',
            pytorch_version: '1.9.0',
            code: 'model-code',
          }),
        })
      );
    });
  });

  test('- Should throw error if required arguments are missing', async () => {
    const run = (await runClient.createRun(experimentId)) as Run;

    // @ts-expect-error: testing for all missing arguments
    await expect(runClient.logModel()).rejects.toThrow(ApiError);
    // @ts-expect-error: testing for missing key and value
    await expect(runClient.logModel(run.info.run_id)).rejects.toThrow(ApiError);
  });

  test('- Should handle API error for invalid model_json structure', async () => {
    const invalid_id = 'invalid_id';
    const invalid_model_json = JSON.stringify({ some: 'data' });

    // the thrown error is specifically an instance of 'ApiError'
    await expect(
      runClient.logModel(invalid_id, invalid_model_json)
    ).rejects.toThrow(
      expect.objectContaining({
        name: 'ApiError',
        message: expect.stringMatching(
          /Error logging model: Model json is missing mandatory fields/
        ),
      })
    );
  });

  test('- Should handle API error for invalid model_json', async () => {
    const run = (await runClient.createRun(experimentId)) as Run;
    const invalid_model_json = 'not a valid JSON';

    await expect(
      runClient.logModel(run.info.run_id, invalid_model_json)
    ).rejects.toThrow(
      expect.objectContaining({
        name: 'ApiError',
        message: expect.stringMatching(
          /Error logging model: Malformed model info/
        ),
      })
    );
  });

  // // POST - Log inputs
  // describe('logInputs', () => {
  //   test('', async () => {});
  // });

  // POST - Set a tag on a run
  describe('setTag', () => {
    test('- Should set a tag on a run with run_id, key, and value', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const key = 'accuracy';
      const value = '0.99';
      await runClient.setTag(run.info.run_id, key, value);

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;
      const tag = fetchedRun.data.tags?.find((t) => t.key === key);
      expect(tag).toBeDefined();
      expect(tag?.value).toBe(value);
    });

    test('- Should throw error if required arguments are missing', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const key = 'accuracy';
      const value = '0.99';

      // @ts-expect-error: testing for all missing arguments
      await expect(runClient.setTag()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing key and value
      await expect(runClient.setTag(run.info.run_id)).rejects.toThrow(ApiError);
      // All required args provided, should not throw
      await expect(
        runClient.setTag(run.info.run_id, key, value)
      ).resolves.not.toThrow(ApiError);
    });

    test('- Should handle API error', async () => {
      const invalid_id = 'invalid_id';

      const key = 'accuracy';
      const value = '0.99';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.setTag(invalid_id, key, value)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error setting tag:.+invalid_id/),
        })
      );
    });
  });

  // POST - Delete a tag on a run
  describe('deleteTag', () => {
    test('- Should delete a tag on a run with run_id and key', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const key = 'test_key';
      const value = 'test_value';

      await runClient.setTag(run.info.run_id, key, value);
      console.log(run.data.tags);

      await runClient.deleteTag(run.info.run_id, key);

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;
      console.log(fetchedRun.data.tags);
    });

    test('- Should throw error if required arguments are missing', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const key = 'test_key';
      const value = 'test_value';
      // @ts-expect-error: testing for all missing arguments
      await expect(runClient.deleteTag()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing key and value
      await expect(runClient.deleteTag(run.info.run_id)).rejects.toThrow(
        ApiError
      );
      // All required args provided, should not throw
      await runClient.setTag(run.info.run_id, key, value);
      await expect(
        runClient.deleteTag(run.info.run_id, key)
      ).resolves.not.toThrow(ApiError);
    });

    test('- Should handle API error', async () => {
      const invalid_id = 'invalid_id';
      const key = 'test_key';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.deleteTag(invalid_id, key)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error deleting tag:.+invalid_id/),
        })
      );
    });
  });

  // POST - Log a param used for a run
  describe('logParam', () => {
    test('- Should log a param used for a run with run_id, key, and value', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const key = 'learning_rate';
      const value = '0.001';
      await runClient.logParam(run.info.run_id, key, value);

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;
      const param = fetchedRun.data.params?.find((p) => p.key === key);
      expect(param).toBeDefined();
      expect(param?.value).toBe(value);
    });

    test('- Should throw error if required arguments are missing', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      const key = 'learning_rate';
      const value = '0.001';

      // @ts-expect-error: testing for all missing arguments
      await expect(runClient.logParam()).rejects.toThrow(ApiError);
      // @ts-expect-error: testing for missing key and value
      await expect(runClient.logParam(run.info.run_id)).rejects.toThrow(
        ApiError
      );
      // All required args provided, should not throw
      await expect(
        runClient.logParam(run.info.run_id, key, value)
      ).resolves.not.toThrow(ApiError);
    });

    test('- Should handle API error', async () => {
      const invalid_id = 'invalid_id';

      const key = 'learning_rate';
      const value = '0.001';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(runClient.logParam(invalid_id, key, value)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error logging param:.+invalid_id/),
        })
      );
    });
  });
});
