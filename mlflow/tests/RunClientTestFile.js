import { RunClient } from '../src/tracking/RunClient.js';

const myRunClient = new RunClient('http://127.0.0.1:5000');

async function testCreateRun(experiment_id) {
  try {
    const run = await myRunClient.createRun(experiment_id);
    console.log('Created run:', run);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// testCreateRun('463611670721534538');

async function testDeleteRun(run_id) {
  try {
    const run = await myRunClient.deleteRun(run_id);
    console.log(`Run ID ${run_id} deleted`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// testDeleteRun('1d3829715bda4e4eb257f68363dacfa6');

async function testRestoreRun(run_id) {
  try {
    const run = await myRunClient.restoreRun(run_id);
    console.log(`Run ID ${run_id} restored`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// testRestoreRun('1d3829715bda4e4eb257f68363dacfa6');

async function testGetRun(run_id) {
  try {
    const run = await myRunClient.getRun(run_id);
    console.log('Fetched run ID: ', run);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// testGetRun('0577e22f02e24d24b62949625306c256');

async function testUpdateRun(run_id, status, end_time, run_name) {
  try {
    const updatedRun = await myRunClient.updateRun(
      run_id,
      status,
      end_time,
      run_name
    );
    console.log('Updated run: ', updatedRun);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// await myRunClient.updateRun(
//   '9acc6e77bc0c4273ab2105e8e6adc38b',
//   'FINISHED',
//   '1631234567890',
//   'hey'
// );

async function testLogMetric(run_id, key, value) {
  try {
    const loggedMetric = await myRunClient.logMetric(run_id, key, value);
    console.log('Metric logged successfully');
  } catch (error) {
    console.error('Error: ', error.message);
  }
}

// testLogMetric('69c2298a1a374e989806ea89ab2b892a', 'metric-01', 0.9);

async function testLogBatch(run_id, metrics, params, tags) {
  try {
    await myRunClient.logBatch(run_id, metrics, params, tags);
  } catch (error) {
    console.error('Error in testLogBatch: ', error);
  }
}

// testLogBatch('521098fe3c6f42ee81fdb82cc1437fef');
// testLogBatch(
//   '0577e22f02e24d24b62949625306c256',
//   [
//     { key: 'mae', value: 2.5, timestamp: 1552550804 },
//     { key: 'rmse', value: 2.7, timestamp: 1552550804 },
//   ],
//   [{ key: 'model_class', value: 'LogisticRegression' }]
// );
// testLogBatch(
//   '1d3829715bda4e4eb257f68363dacfa6',
//   [
//     { key: 'mae', value: 2.2, timestamp: 1552550804 },
//     { key: 'rmse', value: 2.9, timestamp: 1552550804 },
//   ],
//   [{ key: 'model_class', value: 'LogisticRegression' }],
//   [{ key: 'tag_name', value: 'testing' }]
// );

async function testLogModel(run_id, model_json) {
  try {
    const modelJson = JSON.stringify(model_json);

    await myRunClient.logModel(run_id, modelJson);
    console.log('Model logged successfully.');
  } catch (error) {
    console.error('Error: ', error);
  }
}

// testLogModel('69c2298a1a374e989806ea89ab2b892a', {
//   artifact_path: 'model',
//   flavors: {
//     python_function: {
//       model_path: 'model.pkl',
//       loader_module: 'mlflow.sklearn',
//       python_version: '3.8.10',
//     },
//     // sklearn: {
//     //   sklearn_version: '0.19.1',
//     //   pickled_model: 'model.pkl',
//     // },
//   },
//   run_id: '69c2298a1a374e989806ea89ab2b892a',
//   utc_time_created: '2024-08-28 12:00:00.000000',
// });

async function testLogInputs(run_id, datasets) {
  try {
    await myRunClient.logInputs(run_id, datasets);
    console.log('Datasets logged successfully.');
  } catch (error) {
    console.error('Error logging datasets: ', error.message);
  }
}

// testLogInputs('4a6e21f64d9d4201b157e838501b8d9c', [
//   {
//     name: 'wine quality - white',
//     source:
//       'https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-white.csv',
//     targets: 'quality',
//     schema: {
//       columns: [
//         { name: 'fixed acidity', type: 'double' },
//         { name: 'volatile acidity', type: 'double' },
//         { name: 'citric acid', type: 'double' },
//         { name: 'residual sugar', type: 'double' },
//         { name: 'chlorides', type: 'double' },
//         { name: 'free sulfur dioxide', type: 'double' },
//         { name: 'total sulfur dioxide', type: 'double' },
//         { name: 'density', type: 'double' },
//         { name: 'pH', type: 'double' },
//         { name: 'sulphates', type: 'double' },
//         { name: 'alcohol', type: 'double' },
//         { name: 'quality', type: 'long' },
//       ],
//     },
//     // profile: {
//     //   num_rows: rawData.length,
//     //   num_elements: rawData.length * Object.keys(rawData[0]).length,
//     // },
//   },
// ]);

// https://mlflow.org/docs/latest/python_api/mlflow.data.html#mlflow.data.dataset.Dataset
