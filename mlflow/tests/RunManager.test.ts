import { describe, test, expect, beforeAll } from '@jest/globals';
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

  beforeAll(async () => {
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
      // Log the initial state
      (await runClient.searchRuns([experimentId])) as {
        runs: Run[];
      };

      const result = (await runManager.cleanupRuns(
        [experimentId],
        'metrics.metric1 > 15',
        'metric1',
        false // not a dry run
      )) as CleanupRuns;

      const remainingRuns = (await runClient.searchRuns([experimentId])) as {
        runs: Run[];
      };

      expect(result.total).toBe(3);
      expect(result.deletedRuns.length).toBe(3);
      expect(result.dryRun).toBe(false);

      // verify that only one run remains
      expect(remainingRuns.runs.length).toBe(1);
      expect(remainingRuns.runs[0].data.metrics[0].key).toBe('metric1');
      expect(remainingRuns.runs[0].data.metrics[0].value).toBeGreaterThan(15);
    });

    test('- Should not delete runs in dry run mode', async () => {
      const initialRuns = (await runClient.searchRuns([experimentId])) as {
        runs: Run[];
      };

      const result = (await runManager.cleanupRuns(
        [experimentId],
        'metrics.metric1 > 25',
        'metric1',
        true // dry run
      )) as CleanupRuns;

      expect(result.total).toBe(initialRuns.runs.length);
      expect(result.deletedRuns.length).toBe(initialRuns.runs.length);
      expect(result.dryRun).toBe(true);

      // verify that all runs still exist
      const remainingRuns = (await runClient.searchRuns([experimentId])) as {
        runs: Run[];
      };
      expect(remainingRuns.runs.length).toBe(initialRuns.runs.length);
    });
  });
});
