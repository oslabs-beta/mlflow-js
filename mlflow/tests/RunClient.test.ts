import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import RunClient from '../src/tracking/RunClient';
import ExperimentClient from '../src/tracking/ExperimentClient';
import {
  Run,
  Metrics,
  Params,
  Tags,
  MetricHistoryResponse,
} from '../src/utils/interface';

describe('RunClient', () => {
  let runClient: RunClient;
  let experimentClient: ExperimentClient;
  let experimentId: string;

  beforeAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    runClient = new RunClient('http://127.0.0.1:5002');
    experimentClient = new ExperimentClient('http://127.0.0.1:5002');

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

    test('- Should handle errors and edge cases', async () => {
      // test missing run_id
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.createRun()).rejects.toThrow();

      // test invalid id
      const invalid_id = 'invalid_id';
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

    test('- Should handle errors and edge cases', async () => {
      // test missing run_id
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.deleteRun()).rejects.toThrow();

      // test invalid id
      const invalid_id = 'invalid_id';
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

    test('- Should handle errors and edge cases', async () => {
      // test missing run_id
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.restoreRun()).rejects.toThrow();

      // test invalid id
      const invalid_id = 'invalid_id';
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
      const metrics: Metrics[] = [
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
      const fetchedMetrics = fetchedRun.data.metrics as Metrics[];

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

    test('- Should handle errors and edge cases', async () => {
      // test missing run_id
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.getRun()).rejects.toThrow();

      // test invalid id
      const invalid_id = 'invalid_id';
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
    let run: Run;

    beforeEach(async () => {
      run = (await runClient.createRun(experimentId)) as Run;
    });

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
        await runClient.updateRun(run.info.run_id, status);
        const updatedRun = (await runClient.getRun(run.info.run_id)) as Run;
        expect(updatedRun.info.status).toBe(status);
      }
    );

    test('- Should resolve invalid status with "RUNNING"', async () => {
      // call updateRun with invalid status
      await runClient.updateRun(run.info.run_id, 'INVALID_STATUS' as any);

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

      expect(fetchedRun.info.status).toBe('RUNNING');
    });

    test('- Should not throw error when only pass in the run_id', async () => {
      await expect(runClient.updateRun(run.info.run_id)).resolves.toBeDefined();
    });

    test('- Should update run with all parameters', async () => {
      const status = 'FINISHED';
      const end_time = 1994000700000;
      const run_name = 'Updated Run';

      await runClient.updateRun(run.info.run_id, status, end_time, run_name);

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

      expect(fetchedRun.info).toMatchObject({
        run_name,
        status,
        end_time,
      });

      const runNameTag = fetchedRun.data.tags.find(
        (tag) => tag.key === 'mlflow.runName'
      );
      expect(runNameTag).toEqual({ key: 'mlflow.runName', value: run_name });
    });

    test('- Should handle errors and edge cases', async () => {
      // test missing run_id
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.updateRun()).rejects.toThrow(
        /Error updating run:/
      );

      // Test invalid run_id
      const invalid_id = 'invalid_id';
      await expect(runClient.updateRun(invalid_id)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error updating run:.+invalid_id/),
        })
      );

      // Test with invalid end_time
      await expect(
        runClient.updateRun(run.info.run_id, 'FINISHED', 'invalid_time' as any)
      ).rejects.toThrow();

      // Test with empty run_name
      await expect(
        runClient.updateRun(run.info.run_id, 'FINISHED', undefined, '')
      ).resolves.not.toThrow();
    });
  });

  // POST - Log a metric for a run
  describe('logMetric', () => {
    let run: Run;
    const key = 'accuracy';
    const value = 0.9;

    beforeEach(async () => {
      run = (await runClient.createRun(experimentId)) as Run;
    });

    test('- Should log a metric with run_id, key, value, and timestamp', async () => {
      const timestamp = Date.now();

      await expect(
        runClient.logMetric(run.info.run_id, key, value, timestamp)
      ).resolves.not.toThrow();

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

      expect(fetchedRun.info.run_id).toBe(run.info.run_id);
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

    test('- Should handle errors and edge cases', async () => {
      // test missing arguments
      // @ts-expect-error: testing for all missing arguments
      await expect(runClient.logMetric()).rejects.toThrow();
      // @ts-expect-error: testing for missing key and value
      await expect(runClient.logMetric(run.info.run_id)).rejects.toThrow();
      // @ts-expect-error: testing for all missing value
      await expect(runClient.logMetric(run.info.run_id, key)).rejects.toThrow();

      // test invalid run_id
      const invalid_id = 'invalid_id';
      await expect(runClient.logMetric(invalid_id, key, value)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error logging metric:.+invalid_id/),
        })
      );

      // test invalid key
      await expect(
        runClient.logMetric(run.info.run_id, '', value)
      ).rejects.toThrow();

      // test invalid value
      await expect(
        runClient.logMetric(run.info.run_id, key, NaN)
      ).rejects.toThrow();

      // All required args provided, should not throw
      await expect(
        runClient.logMetric(run.info.run_id, key, value)
      ).resolves.not.toThrow();
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

      const metrics: Metrics[] = [
        { key: 'accuracy', value: 0.83, timestamp: 1694000700000 },
        { key: 'loss', value: 0.18, timestamp: 1694000700000 },
      ];

      await runClient.logBatch(run.info.run_id, metrics);

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

      const fetchedMetrics = fetchedRun.data.metrics as Metrics[];

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
      ).rejects.toThrow();
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
      ).rejects.toThrow();
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
      ).rejects.toThrow();
    });

    test('- Should handle errors and edge cases', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.logBatch()).rejects.toThrow();
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.logBatch()).rejects.toThrow(
        /Error logging batch:/
      );

      // test invalid run_id
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
    let run: Run;
    let validModel: any;

    beforeEach(async () => {
      run = (await runClient.createRun(experimentId)) as Run;
      validModel = {
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
    });

    test('- Should log a model with run_id and model_json', async () => {
      const model_json = JSON.stringify(validModel);

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

      expect(loggedModelHistory).toHaveLength(1);

      const loggedModel = loggedModelHistory[0];
      expect(loggedModel).toMatchObject({
        run_id: run.info.run_id,
        artifact_path: validModel.artifact_path,
        utc_time_created: validModel.utc_time_created,
        flavors: validModel.flavors,
      });
    });

    test('- Should handle errors and edge cases', async () => {
      // test missing arguments
      // @ts-expect-error: testing for all missing arguments
      await expect(runClient.logModel()).rejects.toThrow();
      // @ts-expect-error: testing for missing key and value
      await expect(runClient.logModel(run.info.run_id)).rejects.toThrow();

      // Test invalid run_id
      const invalid_id = 'invalid_id';
      await expect(
        runClient.logModel(invalid_id, JSON.stringify(validModel))
      ).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error logging model:/),
        })
      );
      // Test invalid model_json structure
      const invalid_model_json = JSON.stringify({ some: 'data' });
      await expect(
        runClient.logModel(run.info.run_id, invalid_model_json)
      ).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(
            /Error logging model: Model json is missing mandatory fields/
          ),
        })
      );

      // Test invalid JSON
      const not_json = 'not a valid JSON';
      await expect(
        runClient.logModel(run.info.run_id, not_json)
      ).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(
            /Error logging model: Malformed model info/
          ),
        })
      );
    });
  });

  // POST - Log inputs
  describe('logInputs', () => {
    const datasets = [
      {
        tags: [
          { key: 'version', value: '1.0' },
          { key: 'environment', value: 'production' },
        ],
        dataset: {
          name: 'test_dataset',
          digest: 'abc123',
          source_type: 'local',
          source: '/path/to/data.csv',
        },
      },
    ];

    test('- Should log inputs with run_id and datasets', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;
      await runClient.logInputs(run.info.run_id, datasets);

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;

      expect(fetchedRun.inputs).toBeDefined();
      expect(fetchedRun.inputs).toHaveProperty('dataset_inputs');
    });

    test('- Should handle errors and edge cases', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      // test with invalid_id
      const invalid_id = 'invalid_id';
      await expect(runClient.logInputs(invalid_id, datasets)).rejects.toThrow();

      // test with empty datasets
      await expect(
        runClient.logInputs(run.info.run_id, [])
      ).resolves.not.toThrow();

      // test with invalid datasets
      const invalidDatasets = [{ invalidKey: 'invalidValue' }];
      await expect(
        runClient.logInputs(run.info.run_id, invalidDatasets as any)
      ).resolves.not.toThrow();

      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;
      expect(fetchedRun.inputs).toBeDefined();
    });
  });

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

    test('- Should handle errors and edge cases', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;
      const key = 'accuracy';
      const value = '0.99';

      // test missing arguments
      // @ts-expect-error: testing for all missing arguments
      await expect(runClient.setTag()).rejects.toThrow();
      // @ts-expect-error: testing for missing key and value
      await expect(runClient.setTag(run.info.run_id)).rejects.toThrow();
      // All required args provided, should not throw

      // test invalid run_id
      const invalid_id = 'invalid_id';
      await expect(runClient.setTag(invalid_id, key, value)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error setting tag:.+invalid_id/),
        })
      );

      await expect(
        runClient.setTag(run.info.run_id, '', value)
      ).rejects.toThrow();

      await expect(
        runClient.setTag(run.info.run_id, 'empty_value_key', '')
      ).resolves.not.toThrow();

      // Verify empty value was set
      const runWithEmptyValue = (await runClient.getRun(
        run.info.run_id
      )) as Run;
      const emptyValueTag = runWithEmptyValue.data.tags?.find(
        (t) => t.key === 'empty_value_key'
      );
      expect(emptyValueTag).toBeDefined();
      expect(emptyValueTag?.value).toBe('');
    });
  });

  // POST - Delete a tag on a run
  describe('deleteTag', () => {
    const key = 'test_key';
    const value = 'test_value';
    test('- Should delete a tag on a run with run_id and key', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      await runClient.setTag(run.info.run_id, key, value);

      await runClient.deleteTag(run.info.run_id, key);

      // fetch run to confirm changes
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;
      expect(fetchedRun.data.tags).not.toContainEqual({ key, value });
      expect(
        fetchedRun.data.tags.find((tag) => tag.key === key)
      ).toBeUndefined();
    });

    test('- Should handle errors and edge cases', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;

      // testing missing arguments
      // @ts-expect-error: testing for all missing arguments
      await expect(runClient.deleteTag()).rejects.toThrow();
      // @ts-expect-error: testing for missing key and value
      await expect(runClient.deleteTag(run.info.run_id)).rejects.toThrow();

      // test invalid run_id
      const invalid_id = 'invalid_id';
      await expect(runClient.deleteTag(invalid_id, key)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error deleting tag:.+invalid_id/),
        })
      );

      // Test deleting non-existent tag
      await expect(
        runClient.deleteTag(run.info.run_id, 'non_existent_key')
      ).rejects.toThrow();

      // All required args provided, should not throw
      await runClient.setTag(run.info.run_id, key, value);
      await expect(
        runClient.deleteTag(run.info.run_id, key)
      ).resolves.not.toThrow();

      // verify the tag was deleted
      const fetchedRun = (await runClient.getRun(run.info.run_id)) as Run;
      expect(fetchedRun.data.tags).not.toHaveProperty(key);
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

    test('- Should handle errors and edge cases', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;
      const key = 'learning_rate';
      const value = '0.001';

      // @ts-expect-error: testing for all missing arguments
      await expect(runClient.logParam()).rejects.toThrow();
      // @ts-expect-error: testing for missing key and value
      await expect(runClient.logParam(run.info.run_id)).rejects.toThrow();

      // Test invalid run_id
      const invalid_id = 'invalid_id';
      await expect(runClient.logParam(invalid_id, key, value)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error logging param:.+invalid_id/),
        })
      );

      // All required args provided, should not throw
      await expect(
        runClient.logParam(run.info.run_id, key, value)
      ).resolves.not.toThrow();
    });
  });

  // Get a list of all valuse for the specified metric for a given run
  describe('getMetricHisotry', () => {
    test('- Should get a list of all values for the specified metric for a given run with run_id and metric_key', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;
      const key = 'accuracy';
      const value = 0.95;

      await runClient.logMetric(run.info.run_id, key, value);
      const metricHistory = (await runClient.getMetricHistory(
        run.info.run_id,
        key
      )) as MetricHistoryResponse;

      expect(metricHistory).toHaveProperty('metrics');
      expect(Array.isArray(metricHistory.metrics)).toBe(true);
      expect(metricHistory.metrics.length).toBeGreaterThan(0);

      const loggedMetric = metricHistory.metrics.find(
        (metric) => metric.key === key && metric.value === value
      );

      expect(loggedMetric).toBeDefined();
      if (loggedMetric) {
        expect(loggedMetric).toHaveProperty('key', key);
        expect(loggedMetric).toHaveProperty('value', value);
      }

      if (metricHistory.next_page_token) {
        expect(typeof metricHistory.next_page_token).toBe('string');
      }
    });

    test('- Should handle errors and edge cases', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(runClient.getMetricHistory()).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error fetching metric history:/),
        })
      );

      // test invalid run
      const invalid_id = 'invalid_id';
      const key = 'some_metric';

      await expect(runClient.getMetricHistory(invalid_id, key)).rejects.toThrow(
        expect.objectContaining({
          name: 'ApiError',
          message: expect.stringMatching(/Error fetching metric history:/),
        })
      );
    });
  });

  // Search for runs that satisfy expressions
  describe('searchRuns', () => {
    let run1: Run;
    let run2: Run;

    beforeEach(async () => {
      // create two runs with different metrics
      run1 = (await runClient.createRun(experimentId)) as Run;
      await runClient.logMetric(run1.info.run_id, 'metric', 1.0);
      await new Promise((resolve) => setTimeout(resolve, 100));
      run2 = (await runClient.createRun(experimentId)) as Run;
      await runClient.logMetric(run2.info.run_id, 'metric', 2.0);
    });

    test('- Should search for runs with experiment_ids and filter', async () => {
      // search for runs with only tthe experiment_ids
      const searchResult = (await runClient.searchRuns([
        experimentId.toString(),
      ])) as { runs: Run[] };

      expect(searchResult).toBeDefined();
      expect(searchResult.runs).toBeDefined();
      expect(Array.isArray(searchResult.runs)).toBe(true);

      // search for runs with metric > 1.5
      const searchResult2 = (await runClient.searchRuns(
        [experimentId.toString()],
        'metrics.metric > 1.5'
      )) as { runs: Run[] };

      expect(searchResult2).toBeDefined();
      expect(searchResult2.runs[0].info.run_id).toBe(run2.info.run_id);
    });

    test('- Should handle different run_view_types', async () => {
      await runClient.deleteRun(run2.info.run_id);

      // search for active runs only
      const activeResult = (await runClient.searchRuns(
        [experimentId.toString()],
        undefined,
        'ACTIVE_ONLY'
      )) as { runs: Run[] };

      expect(
        activeResult.runs.some((run) => run.info.run_id === run1.info.run_id)
      ).toBe(true);
      expect(
        activeResult.runs.some((run) => run.info.run_id === run2.info.run_id)
      ).toBe(false);

      // search for all runs
      const allResult = (await runClient.searchRuns(
        [experimentId.toString()],
        undefined,
        'ALL'
      )) as { runs: Run[] };

      expect(
        allResult.runs.some((run) => run.info.run_id === run1.info.run_id)
      ).toBe(true);
      expect(
        allResult.runs.some((run) => run.info.run_id === run2.info.run_id)
      ).toBe(true);
    });

    test('- Should put results in correct order', async () => {
      const searchRunsExpId = await experimentClient.createExperiment(
        `Search Runs Test ${Date.now()}`
      );

      const runA = (await runClient.createRun(searchRunsExpId)) as Run;
      await runClient.logMetric(runA.info.run_id, 'metric', 1.0);
      const runB = (await runClient.createRun(searchRunsExpId)) as Run;
      await runClient.logMetric(runB.info.run_id, 'metric', 2.0);
      const runC = (await runClient.createRun(searchRunsExpId)) as Run;
      await runClient.logMetric(runC.info.run_id, 'metric', 3.0);

      // test with ascend order
      const ascResult = (await runClient.searchRuns(
        [searchRunsExpId.toString()],
        undefined,
        undefined,
        undefined,
        ['metrics.metric ASC']
      )) as { runs: Run[] };

      expect(ascResult.runs[0].data.metrics[0].value).toBe(1.0);
      expect(ascResult.runs[1].data.metrics[0].value).toBe(2.0);
      expect(ascResult.runs[2].data.metrics[0].value).toBe(3.0);

      // test with descend order
      const descResult = (await runClient.searchRuns(
        [searchRunsExpId.toString()],
        undefined,
        undefined,
        undefined,
        ['metrics.metric DESC']
      )) as { runs: Run[] };

      expect(descResult.runs[0].data.metrics[0].value).toBe(3.0);
      expect(descResult.runs[1].data.metrics[0].value).toBe(2.0);
      expect(descResult.runs[2].data.metrics[0].value).toBe(1.0);
    });

    test('- Should handle errors and edge cases', async () => {
      const invalid_id = 'invalid_id';
      const invalid_filter_string = 'filter_string';

      // test with invalid experiment id
      const invalidIdResult = (await runClient.searchRuns([invalid_id])) as {
        runs: Run[];
      };
      expect(invalidIdResult).toEqual({});

      // test with valid experiment id but invalid filter string
      await expect(
        runClient.searchRuns([experimentId.toString()], invalid_filter_string)
      ).rejects.toThrow();

      // Test with empty experiment ID array
      const emptyArrayResult = await runClient.searchRuns([]);
      expect(emptyArrayResult).toEqual({});
    });
  });

  // List artifacts for a run
  describe('listArtifacts', () => {
    test('- Should list artifacts with run_id', async () => {
      const run = (await runClient.createRun(experimentId)) as Run;
      const artifacts = await runClient.listArtifacts(run.info.run_id);

      expect(artifacts).toHaveProperty('root_uri');
    });

    test('- Should handle errors and edge cases', async () => {
      // test invalid id
      const invalid_id = 'invalid_id';
      await expect(runClient.listArtifacts(invalid_id)).rejects.toThrow();
    });
  });
});
