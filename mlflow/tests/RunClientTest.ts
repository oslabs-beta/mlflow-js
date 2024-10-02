import { apiRequest } from '../src/utils/apiRequest';
import RunClient from '../src/tracking/RunClient';

async function createExperiment(
  client: RunClient,
  name: string
): Promise<string> {
  const { response, data } = await apiRequest(
    (client as any).baseUrl,
    'experiments/create',
    {
      method: 'POST',
      body: { name },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error creating experiment: ${data.message || response.statusText}`
    );
  }

  return data.experiment_id;
}

async function testRunClient(): Promise<void> {
  const client = new RunClient('http://127.0.0.1:5000');

  try {
    // createRun
    console.log('Creating experiment...');
    const experiment_id = await createExperiment(client, 'Experiment 8');
    console.log('Created experiment ID: ', experiment_id);

    console.log('Creating run...');
    const run = await client.createRun(experiment_id);
    console.log('Created run: ', run);

    // deleteRun
    const runId = run.info.run_id;
    console.log(`Deleting run ID: ${runId}...`);
    await client.deleteRun(runId);
    console.log('Deleted run: ', runId);

    // restoreRun
    console.log(`Restoring run ID: ${runId}...`);
    await client.restoreRun(runId);
    console.log('Restored run: ', runId);

    // getRun
    console.log(`Fetching run ID: ${runId}...`);
    const fetchedRun = await client.getRun(runId);
    console.log('Fetched run: ', fetchedRun);

    // updateRun
    console.log(`Updating run for run ID: ${runId}...`);
    const updatedRun = await client.updateRun(
      runId,
      'FINISHED',
      1728881022624,
      'Ruby'
    );
    console.log('Updated run: ', updatedRun);

    // logMetric
    console.log(`Logging metric for run ID: ${runId}...`);
    await client.logMetric(runId, 'accuracy', 0.9);
    console.log('Logged metric');

    // logBatch
    console.log('Creating another run...');
    const run2 = await client.createRun(experiment_id);
    console.log('Created run2: ', run2);
    const run2Id = run2.info.run_id;

    console.log(`Logging batch for run ID: ${run2Id}...`);
    await client.logBatch(
      run2Id,
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

    // logModel
    console.log(`Logging model for run ID: ${run2Id}...`);
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
      run_id: run2Id,
    };

    const model_json = JSON.stringify(model);

    await client.logModel(run2Id, model_json);
    console.log('Logged model');

    // logInputs
    console.log(`Logging inputs for run ID: ${run2Id}...`);
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

    await client.logInputs(run2Id, datasets);
    console.log('Logged inputs');

    // setTag
    console.log('Creating another run...');
    const run3 = await client.createRun(experiment_id);
    console.log('Created run3: ', run3);
    const run3Id = run3.info.run_id;

    console.log(`Setting tag for run ID ${run3Id}...`);
    await client.setTag(run3Id, 'accuracy', '0.99');
    console.log('Finished setting tag');

    // deleteTag
    console.log(`Deleting tag for run ID: ${run3Id}...`);
    await client.deleteTag(run3Id, 'accuracy');
    console.log('Deleted tag');

    // logParam
    console.log(`Logging param for run ID: ${run3Id}...`);
    await client.logParam(run3Id, 'learning_rate', '0.001');
    console.log('Logged param');

    // getMetricHistory
    console.log(`Logging metric for run ID: ${run3Id}...`);
    await client.logMetric(run3Id, 'accuracy', 0.95);
    console.log('Logged metric');

    console.log(`Fetching metric history for run ID: ${run3Id}...`);
    const metricHistory = await client.getMetricHistory(run3Id, 'accuracy');
    console.log('Fetched metric history: ', metricHistory);

    // searchRuns
    console.log(`Searching runs for experiment ID: 643644329517739250...`);
    const searchedRuns = await client.searchRuns(
      ['643644329517739250'],
      'metrics.accuracy<0.9'
    );
    console.log('Searched runs: ', searchedRuns);

    // listArtifacts
    console.log(`Listing artifacts for run ID ${run3Id}...`);
    const artifacts = await client.listArtifacts(run3Id);
    console.log('Artifacts: ', artifacts);
  } catch (error) {
    console.error('Error: ', error.message);
  }
}

testRunClient();
