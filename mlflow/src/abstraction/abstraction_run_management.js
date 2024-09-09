import { RunManagement } from '../tracking_server/run_management.js';

class Abstraction {
  constructor(trackingUri, path) {
    this.trackingUri = trackingUri;
    this.path = path;
    this.RunManagement = new RunManagement(this.trackingUri, this.path);
  }

  /**
   * Compare runs within an experiment, return a structured comparison.
   *
   * @param {string} experimentId - The ID of the associated experiment. (required)
   * @param {string} [filterString=''] - A filter expression over params, metrics, and tags, that allows returning a subset of runs. The syntax is a subset of SQL that supportts ANDing together binary operations between a param, metric, or tag and a constant. (optional)
   * @param {Object<{key: string, value: number, mode: string}>} [criteria={}] - Specify one criteria for selecting the best run. Specify mode to be one of the following: exact, maximize, minimize, or range. (required)
   * @returns {Promise<Object>} - The created output object.
   */
  async runComparison(experimentId, filterString = '', criteria = {}) {
    // convert the experimentId into an array for the searchRuns method
    const experimentIdArray = [experimentId];
    const runsResponse = await this.RunManagement.searchRuns(
      experimentIdArray,
      filterString
    );

    const runs = runsResponse.runs;

    // extract and compare the specified criteria across runs
    try {
      const runSummary = await this._findBestRunByCriteria(runs, criteria);
      console.log('runSummary: ', runSummary);
      //   console.log('Run Summary: ', JSON.stringify(runSummary, null, 2));
      return runSummary;
    } catch (error) {
      console.error(`Error in generating summary: ${error}`);
    }
  }

  async _findBestRunByCriteria(runs, criteria) {
    // destructure criteria and initiate the runSummary object
    const { key, value, mode } = criteria;
    const runSummary = {
      criteria: criteria,
      valid_runs: [],
      selection_criteria: { metric_key: key, mode: mode },
      message: '',
    };

    const createRunObject = (run) => ({
      run_id: run.info.run_id,
      metrics: run.data.metrics || [],
      params: run.data.params || {},
      tags: run.data.tags || {},
    });

    for (const run of runs) {
      //   console.log(`Analyzing run: ${run.info.run_id}`);
      //   console.log(`Run metrics: ${JSON.stringify(run.data.metrics)}`);

      const metricObject = run.data.metrics.find((m) => m.key === key);
      if (!metricObject) continue;

      const metricValue = metricObject.value;

      switch (mode) {
        case 'exact':
          // convert both to numbers for comparison
          if (Number(metricValue) === Number(value)) {
            return {
              criteria: criteria,
              best_run: createRunObject(run),
              selection_criteria: { metric_key: key, mode: mode },
              message: 'Exact match found.',
            };
          }
          break;
        case 'range':
          const [minValue, maxValue] = value.map(Number);
          if (metricValue >= minValue && metricValue <= maxValue) {
            runSummary.valid_runs.push(createRunObject(run));
          }
          break;
        case 'minimize':
        case 'maximize':
          runSummary.valid_runs.push(createRunObject(run));
          break;
        default:
          throw new Error(`Unsupported mode: ${mode}`);
      }
    }

    // sort the valid_runs according to mode, extract best_run
    // only minimize and maximize mode will show best_run
    if (runSummary.valid_runs.length > 0) {
      if (mode === 'minimize' || mode === 'maximize') {
        runSummary.valid_runs.sort((a, b) => {
          const aValue = a.metrics.find((m) => m.key === key).value;
          const bValue = b.metrics.find((m) => m.key === key).value;
          return mode === 'maximize' ? bValue - aValue : aValue - bValue;
        });
        runSummary.best_run = runSummary.valid_runs[0];
        runSummary.message = `Found ${runSummary.valid_runs.length} runs. Best run selected.`;
      } else if (mode === 'range') {
        runSummary.message = `Found ${runSummary.valid_runs.length} runs within the specified range.`;
      }
    } else {
      runSummary.message = 'No matching runs found.';
    }

    return runSummary;
  }
}

export { Abstraction };
