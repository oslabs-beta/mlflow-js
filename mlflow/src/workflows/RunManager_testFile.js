import { RunManager } from './RunManager.js';
import { RunClient } from '../tracking_server/RunClient.js';

const trackingUri = 'http://127.0.0.1:5000';
const path = '/api/2.0/mlflow';

// const ab = new Abstraction(trackingUri, path);
const ab = new RunManager(trackingUri);
const myRunClient = new RunClient(trackingUri);

// testing searchRuns method
// const runs = await myRunClient.searchRuns(
//   ['284209273010848955'],
//   'metrics.loss > 0.2'
// );
// console.log('Search runs result: ', runs);

// // dry run (simulation)
// try {
//   const result = await ab.cleanupRuns(
//     ['284209273010848955'],
//     'metrics.loss > 0.2',
//     'loss'
//   );
//   console.log(result);
// } catch (error) {
//   console.error('Error: ', error.message, error.stack);
// }

// // delete runs
// try {
//   const result = await ab.cleanupRuns(
//     ['463611670721534538'],
//     'metrics.mae > 2',
//     true
//   );
//   console.log(result);
// } catch (error) {
//   console.error('Error: ', error.message, error.stack);
// }

/************************************************************** */

// // copy run
// await ab.copyRun('ccef2857b95847d4b4f208d1b57b789a', '463611670721534538');

// // check tags
// const run = await myRunClient.getRun('967234581cd24677a355d3987dad7b5d');
// console.log(run.data.tags);
