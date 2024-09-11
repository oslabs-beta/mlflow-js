import { Abstraction } from './RunManager.js';
import { RunManagement } from '../tracking_server/run_management.js';

const trackingUri = 'http://127.0.0.1:5000';
const path = '/api/2.0/mlflow';

// const ab = new Abstraction(trackingUri, path);
const ab = new Abstraction(trackingUri);
const myRunManagement = new RunManagement(trackingUri);

// testing searchRuns method
// const runs = await myRunManagement.searchRuns(['463611670721534538'], '');
// console.log('Search runs result: ', runs);

// // dry run (simulation)
// try {
//   const result = await ab.runCleanup(
//     ['284209273010848955'],
//     'metrics.accuracy > 0.9'
//   );
//   console.log(result.deletedRuns);
// } catch (error) {
//   console.error('Error: ', error.message, error.stack);
// }

// // delete runs
// try {
//   const result = await ab.runCleanup(
//     ['463611670721534538'],
//     'metrics.mae > 2',
//     true
//   );
//   console.log(result);
// } catch (error) {
//   console.error('Error: ', error.message, error.stack);
// }

/************************************************************** */

// move run
// await ab.moveRun(
//   'c3178ac6ee414495b854361c95f9f517',
//   '508915846877934148',
//   'meow'
// );

// check tags
// const run = await myRunManagement.getRun('c3178ac6ee414495b854361c95f9f517');
// console.log(run.data.tags);
