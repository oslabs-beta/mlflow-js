import { Abstraction } from './abstraction_run_management.js';
import { RunManagement } from '../tracking_server/run_management.js';

const trackingUri = 'http://127.0.0.1:5000';
const path = '/api/2.0/mlflow';

// const ab = new Abstraction(trackingUri, path);
const ab = new Abstraction(trackingUri);
const myRunManagement = new RunManagement(trackingUri);

// // testing searchRuns method
// const runs = await myRunManagement.searchRuns(['463611670721534538'], '');
// console.log('Search runs result: ', runs);

// // dry run (simulation)
// try {
//   const result = await ab.runCleanup(
//     ['463611670721534538'],
//     'metrics.rmse > 2'
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
