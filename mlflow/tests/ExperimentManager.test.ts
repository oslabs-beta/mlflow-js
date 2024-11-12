import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { ApiError } from '../src/utils/apiError';
import ExperimentClient from '../src/tracking/ExperimentClient';
import ExperimentManager from '../src/workflows/ExperimentManager';
import { Run, RunInfo } from '../src/utils/interface';

describe('ExperimentManager', () => {
  let experimentClient: ExperimentClient;
  let experimentManager: ExperimentManager;
  const testIds: string[] = [];

  // type experiment = {
  //   experiment_id: string;
  //   name: string;
  //   artifact_location: string;
  //   lifecycle_stage: string;
  //   last_update_time: string;
  //   creation_time: string;
  // };

  // type RunInfo = {
  //   run_id?: string;
  //   run_uuid?: string;
  //   run_name?: string;
  //   experiment_id?: string;
  //   user_id?: string;
  //   status?: 'RUNNING' | 'FINISHED' | 'SCHEDULED' | 'FAILED' | 'KILLED';
  //   start_time?: number;
  //   end_time?: number;
  //   artifact_uri?: string;
  //   lifecycle_stage?: string;
  // };

  interface ExperimentSummaryResults extends Run {
    metric1: number;
  };

  const metrics = [
    { key: 'metric1', value: 0.111, timestamp: Date.now() },
    { key: 'metric2', value: 0.222, timestamp: Date.now() },
  ];
  const params = [
    { key: 'testParam', value: 'testParamValue' },
    { key: 'testParam2', value: 'testParamValue2' },
  ];
  const tags = [
    { key: 'testKey', value: 'testValue' },
    { key: 'testKey2', value: 'testValue2' },
  ];
  const model = {
    artifact_path: 'model',
    flavors: {
      python_function: {
        model_path: 'model.pkl',
        loader_module: 'mlflow.sklearn',
        python_version: '3.8.10',
      },
    },
    model_url: 'STRING',
    model_uuid: 'STRING',
    utc_time_created: Date.now(),
    mlflow_version: 'STRING',
  };
  const metricsAll = [
    [
      { key: 'metric1', value: 0.1, timestamp: Date.now() }
    ],
    [
      { key: 'metric1', value: 0.2, timestamp: Date.now() }
    ],
    [
      { key: 'metric1', value: 0.3, timestamp: Date.now() }
    ],
    [
      { key: 'metric1', value: 0.4, timestamp: Date.now() }
    ],
    [
      { key: 'metric1', value: 0.5, timestamp: Date.now() }
    ],

  ];

  beforeAll(async () => {
    // Add a small delay to ensure MLflow is fully ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
    experimentClient = new ExperimentClient('http://127.0.0.1:5002');
    experimentManager = new ExperimentManager('http://127.0.0.1:5002');
  });

  describe('runExistingExperiment', () => {
    test('should run an existing experiment and return the run object', async () => {
      const num = Math.random().toString().slice(2, 11);
      const name = `Test experiment ${num}`;
      const exp = await experimentClient.createExperiment(name);
      testIds.push(exp);

      const run: RunInfo = await experimentManager.runExistingExperiment(
        exp,
        undefined,
        metrics,
        params,
        tags,
        model
      );

      expect(run).toHaveProperty('run_id');
      expect(run).toHaveProperty('run_uuid');
      expect(run).toHaveProperty('run_name');
      expect(run).toHaveProperty('experiment_id');
      expect(run).toHaveProperty('user_id');
      expect(run).toHaveProperty('status');
      expect(run).toHaveProperty('start_time');
      expect(run).toHaveProperty('artifact_uri');
      expect(run).toHaveProperty('lifecycle_stage');
    });
  });

  describe('runNewExperiment', () => {
    test('should run a new experiment and return the run object', async () => {
      const num = Math.random().toString().slice(2, 11);
      const name = `Test experiment ${num}`;
      const run: RunInfo = await experimentManager.runNewExperiment(
        name,
        undefined,
        metrics,
        params,
        tags,
        model
      );
      if (run.experiment_id) {
        testIds.push(run.experiment_id);
      }

      expect(run).toHaveProperty('run_id');
      expect(run).toHaveProperty('run_uuid');
      expect(run).toHaveProperty('run_name');
      expect(run).toHaveProperty('experiment_id');
      expect(run).toHaveProperty('user_id');
      expect(run).toHaveProperty('status');
      expect(run).toHaveProperty('start_time');
      expect(run).toHaveProperty('artifact_uri');
      expect(run).toHaveProperty('lifecycle_stage');
    });
  });

  describe('experimentSummary', () => {
    test('should return an array of all the passed-in experiment\'s runs, sorted according to the passed-in metric', async () => {
      const num = Math.random().toString().slice(2, 11);
      const name = `Test experiment ${num}`;
      const exp = await experimentClient.createExperiment(name);
      testIds.push(exp);
      for (const metric of metricsAll) {
        await experimentManager.runExistingExperiment(
          exp,
          undefined,
          metric,
          params,
          tags,
          model
        );
      };
      const summary = await experimentManager.experimentSummary(
        exp,
        'metric1',
        'DESC'
      );

      console.log('summary - ', summary);

      expect(Array.isArray(summary)).toBe(true);
      expect(summary.length).toBe(5);

      expect(summary[0].metric1.value).toBe(0.5);
    });
  });

  afterAll(async () => {
    while (testIds.length > 0) {
      const id = testIds.pop();
      if (id) {
        await experimentClient.deleteExperiment(id);
      }
    }
  });
});
