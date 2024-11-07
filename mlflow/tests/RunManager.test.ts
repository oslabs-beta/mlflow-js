import { describe, test, expect, beforeEach } from '@jest/globals';
import RunManager from '../src/workflows/RunManager';
import RunClient from '../src/tracking/RunClient';
import ExperimentClient from '../src/tracking/ExperimentClient';
import { Run, CleanupRuns } from '../src/utils/interface';

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

  describe('cleanupRuns', () => {
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

      expect(result.deletedRuns.length).toBe(1);
      expect(result.dryRun).toBe(false);
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

      const deletedMetric1Values = result.deletedRuns.map(
        (run) => run.data.metrics.find((m) => m.key === 'metric1')?.value
      );
      expect(deletedMetric1Values).toEqual(expect.arrayContaining([10, 20]));

      const deletedMetricKeys = result.deletedRuns.flatMap((run) =>
        run.data.metrics.map((m) => m.key)
      );
      expect(deletedMetricKeys).not.toContain('metric2');
      expect(deletedMetricKeys).not.toContain('metric3');
    });
  });
});
