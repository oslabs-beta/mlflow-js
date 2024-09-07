import { RunManagement } from './run_management.js';

let domain = 'http://localhost:';
const port = 5001;
if (port) {
  domain = domain + port;
}

const version = '2.0';

// const MLFLOW_TRACKING_URI = domain + '/api/' + version + '/mlflow';
const MLFLOW_TRACKING_URI = domain;

let runManagement = new RunManagement(MLFLOW_TRACKING_URI);
// let runManagement = new RunManagement(MLFLOW_TRACKING_URI);
// console.log(runManagement.searchRuns(['784321942139901150']));

const test = async () => {
  // searchRuns
  try {
    let data = await runManagement.searchRuns(['784321942139901150']);
    console.log('searchRuns data: ', data);
  } catch (err) {
    console.log('searchRuns err: ', err);
  }

  // listArtifacts
  try {
    let data = await runManagement.listArtifacts(
      'b3457c87f50440388da9d9ddabb1baaa'
    );
    console.log('listArtifacts data: ', data);
  } catch (err) {
    console.log('listArtifacts err: ', err);
  }

  // searchRuns
  try {
    // let data = await runManagement.searchRuns(
    //   '',
    //   `metrics."model class" = sk-learn-random-forest-reg-model
    //   '`
    // );
    // let data = await runManagement.searchRuns(['*']);
    console.log('searchRuns data test: ', data);
  } catch (err) {
    console.log('searchRuns test err: ', err);
  }
};

test();

// let runManagement = new RunManagement(MLFLOW_TRACKING_URI, path);
// console.log(runManagement.listArtifacts('b3457c87f50440388da9d9ddabb1baaa', 'mlflow-artifacts:/784321942139901150/b3457c87f50440388da9d9ddabb1baaa/artifacts/iris_model'));
// console.log('listArtifacts: ', runManagement.listArtifacts('b3457c87f50440388da9d9ddabb1baaa'));
// console.log(runManagement.searchRuns(['784321942139901150']));
// console.log(runManagement.searchRuns());
// console.log(runManagement.getMetricHistory('b3457c87f50440388da9d9ddabb1baaa', 'accuracy'));
// console.log(runManagement.logParam('b3457c87f50440388da9d9ddabb1baaa','test2', '008'));
// console.log(runManagement.setTag('b3457c87f50440388da9d9ddabb1baaa', 'testTag1', 'testTag1Val'))
// console.log(runManagement.deleteTag('b3457c87f50440388da9d9ddabb1baaa', 'testTag1'))

// let modelRegistry = new ModelRegistry(MLFLOW_TRACKING_URI);
// console.log(modelRegistry.setRegisteredModelAlias('tracking-quickstart', 'aliasTest', '1'));
// console.log(modelRegistry.deleteRegisteredModelAlias('tracking-quickstart', 'aliasTest'));
// console.log(modelRegistry.getModelVersionByAlias('sk-learn-random-forest-reg-model', 'the_best_model_ever'));
