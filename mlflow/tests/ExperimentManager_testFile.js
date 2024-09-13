import { ExperimentManager } from '../src/workflows/ExperimentManager.js';
import { ExperimentClient } from '../src/tracking/ExperimentClient.js';
const MLFLOW_TRACKING_URI = 'http://localhost:5001';
const experimentManager = new ExperimentManager(MLFLOW_TRACKING_URI);
const experimentClient = new ExperimentClient(MLFLOW_TRACKING_URI);

const testRunExistingExperiment = async () => {
  // define fake data for metrics, params, tags, and model
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

  // construct random name to avoid duplicate names in the tracking server
  const num = Math.random().toString().slice(2, 11);
  const name = `Test experiment ${num}`;

  // pass the randomized name into .createExperiment to create a new experiment. this stores its experiment ID under the 'exp' variable
  const exp = await experimentClient.createExperiment(name);

  // call .runExistingExperiment on our newly created experiment, passing in the fake data, and store the results under the variable 'log'
  const log = await experimentManager.runExistingExperiment(
    exp,
    undefined,
    metrics,
    params,
    tags,
    model
  );
  return console.log(log);
};
// testRunExistingExperiment();

const testRunNewExperiment = async () => {
  // define fake data for metrics, params, tags, and model
  const metrics = [
    { key: 'metric1', value: 0.9, timestamp: Date.now() },
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

  // construct random name to avoid duplicate names in the tracking server
  const num = Math.random().toString().slice(2, 11);
  const name = `Test experiment ${num}`;

  // call .runNewExperiment using our randomly generated name, passing in the fake data, and store the results under the variable 'log'
  const log = await experimentManager.runNewExperiment(
    name,
    undefined,
    metrics,
    params,
    tags,
    model
  );
  return console.log(log);
};
// testRunNewExperiment();

const testExperimentSummary = async () => {
  const log = await experimentManager.experimentSummary(
    '787867007534323476',
    'metric1',
    'DESC'
  );
  return console.log(log);
};
// testExperimentSummary();
