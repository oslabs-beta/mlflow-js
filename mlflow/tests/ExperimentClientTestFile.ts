import ExperimentClient from '../src/tracking/ExperimentClient.ts';
const MLFLOW_TRACKING_URI = 'http://localhost:5001';
const experimentClient = new ExperimentClient(MLFLOW_TRACKING_URI);

const testCreateExperiment = async () => {
  const num = Math.random().toString().slice(2, 11);
  const name = `Test experiment ${num}`;
  const log = await experimentClient.createExperiment(name);
  return console.log(log);
};
// testCreateExperiment();

const testSearchExperiment = async () => {
  const num1 = Math.random().toString().slice(2, 11);
  const name1 = `Search test ${num1}`;
  // Experiment 1
  await experimentClient.createExperiment(name1);

  const num2 = Math.random().toString().slice(2, 11);
  const name2 = `Search test ${num2}`;
  // Experiment 2
  await experimentClient.createExperiment(name2);

  const num3 = Math.random().toString().slice(2, 11);
  const name3 = `Search test ${num3}`;
  // Experiment 3
  await experimentClient.createExperiment(name3);

  const num4 = Math.random().toString().slice(2, 11);
  const name4 = `Search test ${num4}`;
  // Experiment 4
  await experimentClient.createExperiment(name4);

  const num5 = Math.random().toString().slice(2, 11);
  const name5 = `Search test ${num5}`;
  // Experiment 5
  await experimentClient.createExperiment(name5);

  const log = await experimentClient.searchExperiment(
    "name LIKE 'Search test%'",
    4
  );
  console.log(log);
};
testSearchExperiment();

const testGetExperiment = async () => {
  const num = Math.random().toString().slice(2, 11);
  const name = `Test experiment ${num}`;
  const exp = await experimentClient.createExperiment(name);
  const log = await experimentClient.getExperiment(exp);
  console.log(log);
};
// testGetExperiment();

const testGetExperimentByName = async () => {
  const num = Math.random().toString().slice(2, 11);
  const name = `Test experiment ${num}`;
  await experimentClient.createExperiment(name);
  const log = await experimentClient.getExperimentByName(name);
  console.log(log);
};
// testGetExperimentByName();

const testDeleteExperiment = async () => {
  const num = Math.random().toString().slice(2, 11);
  const name = `Test experiment ${num}`;
  const exp = await experimentClient.createExperiment(name);
  await experimentClient.deleteExperiment(exp);
  const log2 = await experimentClient.getExperiment(exp);
  console.log(log2);
  experimentClient.restoreExperiment(exp);
};
// testDeleteExperiment();

const testRestoreExperiment = async () => {
  const num = Math.random().toString().slice(2, 11);
  const name = `Test experiment ${num}`;
  const exp = await experimentClient.createExperiment(name);
  const log = await experimentClient.getExperiment(exp);
  console.log(log);
  await experimentClient.deleteExperiment(exp);
  const log2 = await experimentClient.getExperiment(exp);
  console.log(log2);
  await experimentClient.restoreExperiment(exp);
  const log4 = await experimentClient.getExperiment(exp);
  console.log(log4);
};
// testRestoreExperiment();

const testUpdateExperiment = async () => {
  const num = Math.random().toString().slice(2, 11);
  const name = `Test experiment ${num}`;
  const exp = await experimentClient.createExperiment(name);
  const log = await experimentClient.getExperiment(exp);
  console.log(log);
  await experimentClient.updateExperiment(
    exp,
    `${name}_UPDATED_NAME`
  );
  const log3 = await experimentClient.getExperiment(exp);
  console.log(log3);
  // Reverting to old name
  await experimentClient.updateExperiment(exp, name);
};
// testUpdateExperiment();

const testSetExperimentTag = async () => {
  const num = Math.random().toString().slice(2, 11);
  const name = `Test experiment ${num}`;
  const exp = await experimentClient.createExperiment(name);
  const log = await experimentClient.getExperiment(exp);
  console.log(log);
  const num2 = Math.random().toString().slice(2, 11);
  await experimentClient.setExperimentTag(
    exp,
    'test_tag',
    `test_value_${num2}`
  );
  const log3 = await experimentClient.getExperiment(exp);
  console.log(log3);
};
// testSetExperimentTag();
