import RunClient from '../src/tracking/RunClient';
import RunManager from '../src/workflows/RunManager';
import ExperimentClient from '../src/tracking/ExperimentClient';

// test code for cleanupRuns
async function testCleanupRuns(): Promise<any> {
  const myRunClient = new RunClient('http://127.0.0.1:5000');
  const myRunManager = new RunManager('http://127.0.0.1:5000');
  const myExperimentClient = new ExperimentClient('http://127.0.0.1:5000');

  try {
    // create 2 experiments
    console.log('Creating experiment Test Cleanup Run 1...');
    const experiment_id1 = await myExperimentClient.createExperiment(
      'Test Cleanup Run 1'
    );

    console.log('Creating experiment Test Cleanup Run 2...');
    const experiment_id2 = await myExperimentClient.createExperiment(
      'Test Cleanup Run 2'
    );

    // create two runs for each experiment
    console.log('Creating runs...');
    const run1 = await myRunClient.createRun(experiment_id1);
    const run2 = await myRunClient.createRun(experiment_id1);
    console.log('Created runs for Test Cleanup Run 1');
    const run3 = await myRunClient.createRun(experiment_id2);
    const run4 = await myRunClient.createRun(experiment_id2);
    console.log('Created runs for Test Cleanup Run 2');

    // log metrics
    const run1_id = run1.info.run_id;
    const run2_id = run2.info.run_id;
    const run3_id = run3.info.run_id;
    const run4_id = run4.info.run_id;

    console.log(`Logging metric for run ID ${run1_id} and ${run2_id}`);
    await myRunClient.logMetric(run1_id, 'accuracy', 0.85);
    await myRunClient.logMetric(run2_id, 'accuracy', 0.96);

    console.log(`Logging metric for run ID ${run3_id} and ${run4_id}`);
    await myRunClient.logMetric(run3_id, 'accuracy', 0.93);
    await myRunClient.logMetric(run4_id, 'accuracy', 0.99);

    // use cleanupRuns to sort runs to keep
    console.log('Cleaning up runs...');
    const deletedRuns = await myRunManager.cleanupRuns(
      [experiment_id1, experiment_id2],
      'metric.accuracy > 0.95',
      'accuracy'
    );

    console.log('Details of runs being filtered out: ', deletedRuns);
  } catch (error) {
    console.error('Error: ', error.message);
  }
}

// test code for copyRun

async function testCopyRun(): Promise<any> {
  const myRunClient = new RunClient('http://127.0.0.1:5000');
  const myRunManager = new RunManager('http://127.0.0.1:5000');
  const myExperimentClient = new ExperimentClient('http://127.0.0.1:5000');

  try {
    console.log('Testing copy run...');

    // create a new experiment
    console.log('Creating a new experiment and log batch for the new run...');
    const experiment_id1 = await myExperimentClient.createExperiment(
      'Test Copy Run 1'
    );

    // create a new run in the newly created experiment
    console.log('Creating run...');
    const run = await myRunClient.createRun(experiment_id1);
    console.log('Created run: ', run);

    // log batch for that run ID
    const runId = run.info.run_id;
    console.log('Logging batch for run ID: ', runId);
    await myRunClient.logBatch(
      runId,
      [
        { key: 'accuracy', value: 0.83, timestamp: 1694000700000 },
        { key: 'loss', value: 0.18, timestamp: 1694000700000 },
      ],
      [
        { key: 'learning_rate', value: '0.0001' },
        { key: 'batch_size', value: '256' },
      ],
      [
        { key: 'model_type', value: 'GradientBoosting' },
        { key: 'data_version', value: 'v1.7' },
      ]
    );
    console.log('Logged batch');

    // log inputs for that run ID
    console.log('Logging inputs for run ID: ', runId);

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

    await myRunClient.logInputs(runId, datasets);
    console.log('Logged inputs');

    // log model for that run ID
    console.log('Logging model for run ID: ', runId);

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
      mlflow_version: '1.20.2',
      model_uuid: '123e4567-e89b-12d3-a456-426614174001',
      utc_time_created: '2023-09-14 10:15:00.000000',
      run_id: runId,
    };

    const model_json = JSON.stringify(model);
    await myRunClient.logModel(runId, model_json);
    console.log('Logged model');

    // create another experiment
    console.log('Create a target experiment...');
    const experiment_id2 = await myExperimentClient.createExperiment(
      'Test Copy Run 2'
    );

    // copy previous run to this newly created experiment
    console.log('Copying run...');
    const copiedRun = await myRunManager.copyRun(runId, experiment_id2);
    console.log('Copied run: ', copiedRun);
  } catch (error) {
    if (error) console.error('Error: ', error.message);
  }
}

testCopyRun();
testCleanupRuns();
