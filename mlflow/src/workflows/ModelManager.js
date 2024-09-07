import { ModelRegistry } from '../model_registry/model_registry.js';
// import { ModelVersion } from '../model_registry/model_version_management';
import { RunManagement } from '../tracking_server/run_management.js';

const modelRegistry = new ModelRegistry('http://localhost:5001');
// const modelVersion = new ModelVersion ('http://localhost:5001');
const runManagement = new RunManagement('http://localhost:5001');

async function searchExperiment(
  max_results = 1000,
  page_token = '',
  filter,
  order_by = [],
  view_type = ''
) {
  // if (!filter) {
  //   throw new Error('Filter is required');
  // }
  // if (!max_results) {
  //   throw new Error('Max results is required');
  // }

  const url = `http://localhost:5001/api/2.0/mlflow/experiments/search`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      max_results,
      page_token,
      filter,
      order_by,
      view_type,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      `Error searching for experiment from tracking server, status: ${response.status}.  ${errorBody.message}`
    );
  }

  const data = await response.json();
  // console.log('return from searchExperiment: ', data);
  return data;
}

class ModelManager {
  constructor(trackingUri) {
    this.trackingUri = trackingUri;
  }

  /**
   *
   * @param {string} name - model name
   * @param {*} version
   */
  async modelVersionLineage(name, version) {
    // const modelVersion = await modelVersion.getModelVersion(name, version);
    const {experiments} = await searchExperiment();
    const expArray = [];
    console.log('experiments: ', experiments);
    for (let i = 0; i < experiments.length; i++) {
      expArray.push(experiments[i].experiment_id);

      const {runs} = await runManagement.searchRuns([
        experiments[i].experiment_id,
      ]);
      if (runs) {
        console.log(`${experiments[i].name} runs: `, runs);
        // console.log('runs[0].data: ', runs[0].data);
      }
      // if (runs) {
      //   for (let x = 0; x < runs.length; x++) {
      //     const run = await runManagement.getRun(runs[x].info.run_id);
      //     console.log(`run${x}: `, run);
      //     // console.log(`run.data${x}: `, run.data);
      //   }
      // }
    }
    const { runs } = await runManagement.searchRuns(expArray);
    // console.log('runs: ', runs);
    for (let z = 0; z < runs.length; z++) {
      // console.log(`runs[${z}].data.metrics: `, runs[z].data.metrics);
    }
  }
}

const modelManager = new ModelManager('http://localhost:5001');
modelManager.modelVersionLineage('sk-learn-random-forest-reg-model');
