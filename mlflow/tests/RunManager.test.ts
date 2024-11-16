import { describe, test, expect, beforeEach } from '@jest/globals';
import RunManager from '../src/workflows/RunManager';
import RunClient from '../src/tracking/RunClient';
import ExperimentClient from '../src/tracking/ExperimentClient';
import { Run, CleanupRuns, CopyRun } from '../src/utils/interface';

describe('RunManager', () => {
  let runManager: RunManager;
  let runClient: RunClient;
  let experimentClient: ExperimentClient;
  let experimentId: string;
  const runIds: string[] = [];

  beforeEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    runClient = new RunClient('http://127.0.0.1:5002');
    experimentClient = new ExperimentClient('http://127.0.0.1:5002');
    runManager = new RunManager('http://127.0.0.1:5002');
  });

  describe('cleanupRuns', () => {
    beforeEach(async () => {
      const timestamp = Date.now();
      experimentId = await experimentClient.createExperiment(
        `Testing ${timestamp}`
      );

      // create test runs
      const createRun = async (metricKey: string, metricValue: number) => {
        const run = (await runClient.createRun(experimentId)) as Run;
        await runClient.logMetric(run.info.run_id, metricKey, metricValue);
        runIds.push(run.info.run_id);
        return run;
      };

      await createRun('metric1', 10);
      await createRun('metric1', 20);
      await createRun('metric2', 30);
      await createRun('metric3', 40);
    });

    test('- Should delete runs not matching criteria', async () => {
      (await runClient.searchRuns([experimentId])) as { runs: Run[] };

      const result = (await runManager.cleanupRuns(
        [experimentId],
        'metrics.metric1 > 15',
        'metric1',
        false // not a dry run
      )) as CleanupRuns;

      const remainingRuns = (await runClient.searchRuns([experimentId])) as {
        runs: Run[];
      };

      expect(result.dryRun).toBe(false);
      expect(result.total).toBe(1);
      expect(result.deletedRuns.length).toBe(1);
      expect(remainingRuns.runs.length).toBe(3);

      // verify that remaining runs all have metric1 > 15
      for (const run of remainingRuns.runs) {
        const metric1 = run.data.metrics.find((m) => m.key === 'metric1');
        if (metric1) {
          expect(metric1.value).toBeGreaterThan(15);
        }
      }
    });

    test('- Should not delete runs in dry run mode', async () => {
      const initialRuns = (await runClient.searchRuns([experimentId])) as {
        runs: Run[];
      };

      expect(initialRuns.runs.length).toBe(4);

      const result = (await runManager.cleanupRuns(
        [experimentId],
        'metrics.metric1 > 25',
        'metric1',
        true // dry run
      )) as CleanupRuns;

      const remainingRuns = (await runClient.searchRuns([experimentId])) as {
        runs: Run[];
      };

      expect(result.deletedRuns.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.dryRun).toBe(true);
      expect(remainingRuns.runs.length).toBe(4);

      // verify the runs identified for deletion
      const deletedMetric1Values = result.deletedRuns.map(
        (run) => run.data.metrics.find((m) => m.key === 'metric1')?.value
      );
      expect(deletedMetric1Values).toEqual(expect.arrayContaining([10, 20]));

      // verify that runs with metric2 and metric3 are not in deletedRuns
      const deletedMetricKeys = result.deletedRuns.flatMap((run) =>
        run.data.metrics.map((m) => m.key)
      );
      expect(deletedMetricKeys).not.toContain('metric2');
      expect(deletedMetricKeys).not.toContain('metric3');
    });
  });

  describe('copyRun', () => {
    let originalRunId: string;
    let sourceExperimentId: string;
    let targetExperimentId: string;
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
    let model;

    beforeEach(async () => {
      const timestamp = Date.now();
      sourceExperimentId = await experimentClient.createExperiment(
        `Source Exp ${timestamp}`
      );
      targetExperimentId = await experimentClient.createExperiment(
        `Target Exp ${timestamp}`
      );

      // log data for original run
      const run = (await runClient.createRun(sourceExperimentId)) as Run;
      originalRunId = run.info.run_id;

      model = {
        artifact_path: 'pytorch_dnn',
        flavors: {
          python_function: {
            env: 'conda.yaml',
            loader_module: 'mlflow.pytorch',
            model_path: 'model.pth',
            python_version: '3.8.10',
          },
        },
        mlflow_version: '1.20.2',
        model_uuid: '123e4567-e89b-12d3-a456-426614174001',
        utc_time_created: '2023-09-14 10:15:00.000000',
        run_id: originalRunId,
      };

      const model_json = JSON.stringify(model);

      await runClient.logBatch(
        originalRunId,
        [
          { key: 'metric-key1', value: 10, timestamp: 1694000700000 },
          { key: 'metric-key2', value: 20, timestamp: 1694000700000 },
        ],
        [
          { key: 'param-key1', value: 'param-value1' },
          { key: 'param-key2', value: 'param-value2' },
        ],
        [
          { key: 'tag-key1', value: 'tag-value1' },
          { key: 'tag-key2', value: 'tag-value2' },
        ]
      );

      await runClient.logInputs(originalRunId, datasets);
      await runClient.logModel(originalRunId, model_json);
      await runClient.updateRun(
        originalRunId,
        'FINISHED',
        1694000800000,
        'NewName'
      );
    });

    test('- Should copy run from one experiment to another', async () => {
      const result = (await runManager.copyRun(
        originalRunId,
        targetExperimentId
      )) as CopyRun;

      expect(result).toHaveProperty('originalRunId', originalRunId);
      expect(result).toHaveProperty('newRunId');
      expect(result).toHaveProperty('targetExperimentId', targetExperimentId);

      // fetch copied run and check the metrics
      const copiedRun = (await runClient.getRun(result.newRunId)) as Run;

      expect(copiedRun.data.metrics).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: 'metric-key1', value: 10 }),
          expect.objectContaining({ key: 'metric-key2', value: 20 }),
        ])
      );

      expect(copiedRun.data.params).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: 'param-key1', value: 'param-value1' }),
          expect.objectContaining({ key: 'param-key2', value: 'param-value2' }),
        ])
      );

      expect(copiedRun.data.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: 'tag-key1', value: 'tag-value1' }),
          expect.objectContaining({ key: 'tag-key2', value: 'tag-value2' }),
        ])
      );
    });
  });
});
