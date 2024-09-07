const MLFLOW_TRACKING_URI = 'http://localhost:5001/api/2.0/mlflow';

/**
 * Create an experiment with a name. Returns the ID of the newly created experiment.
 * Validates that another experiment with the same name does not already exist and fails if another experiment with the same name already exists.
 *
 * @param {string} name Experiment name.  (required)
 * @param {string} artifact_location Optional location where all artifacts for the experiment are stored.
 *    If not provided, the remote server will select an appropriate default.
 * @param {Array<{key: string, value: string}>} tags Optional collection of tags to set on the experiment.
 * @returns {Promise<Object>} Returns the ID of the newly created experiment in an object.
 */
async function createExperiment(name, artifact_location = '', tags = []) {
  if (!name) {
    throw new Error('Experiment name is required');
  }

  const url = `${MLFLOW_TRACKING_URI}/experiments/create`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, artifact_location, tags }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      `Error creating experiment from tracking server, status: ${response.status}.  ${errorBody.message}`
    );
  }

  const data = await response.json();
  // console.log('return from createExperiment: ', data);
  return data;
}

// test ****************************************************************************************************************************************
const testCreateExperiment = async () => {
  const log = await createExperiment('test_experiment_postman21');
  return console.log(log);
};
// uncomment below ---
// testCreateExperiment();

/**
 * Search experiments.
 *
 * @param {string} filter A filter expression over experiment attributes and tags that allows returning a subset of experiments
 *    The syntax is a subset of SQL.  (required)
 * @param {int64} max_results Maximum number of experiments desired.  (required)
 * @param {string} page_token Optional token indicating the page of experiments to fetch.
 * @param {Array<string>} order_by Optional list of columns for ordering search results.
 * @param {string} view_type Optional qualifier for type of experiments to be returned.
 *    See https://mlflow.org/docs/latest/rest-api.html#mlflowviewtype
 * @returns {Promise<Object>} Returns object containing an array of experiment objects matching the filter,
 *    and optionally a next_page_token that can be used to retrieve the next page of experiments.
 */
async function searchExperiment(
  filter,
  max_results,
  page_token = '',
  order_by = [],
  view_type = ''
) {
  if (!filter) {
    throw new Error('Filter is required');
  }
  if (!max_results) {
    throw new Error('Max results is required');
  }

  const url = `${MLFLOW_TRACKING_URI}/experiments/search`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filter,
      max_results,
      page_token,
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

// test ****************************************************************************************************************************************
const testSearchExperiment = async () => {
  const log = await searchExperiment("name LIKE 'test_%'", 5);
  console.log(log);
};
// uncomment below ---
// testSearchExperiment();

/**
 * Get metadata for an experiment, querying by experiment ID. This method works on deleted experiments.
 *
 * @param {string} experiment_id ID of the associated experiment.  (required)
 * @returns {Promise<Object>} Returns object containing the matched experiment.
 */
async function getExperiment(experiment_id) {
  if (!experiment_id) {
    throw new Error('Experiment ID is required');
  }

  const url = `${MLFLOW_TRACKING_URI}/experiments/get?experiment_id=${experiment_id}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      `Error getting experiment from tracking server, status: ${response.status}.  ${errorBody.message}`
    );
  }

  const data = await response.json();
  // console.log('return from getExperiment: ', data.experiment);
  return data.experiment;
}

// test ****************************************************************************************************************************************
const testGetExperiment = async () => {
  const log = await getExperiment('977566317259111173');
  console.log(log);
};
// uncomment below ---
// testGetExperiment();

/**
 * Get metadata for an experiment, querying by experiment name.
 * This endpoint will return deleted experiments,
 * but prefers the active experiment if an active and deleted experiment share the same name.
 * If multiple deleted experiments share the same name, the API will return one of them.
 *
 * @param {string} experiment_name ID of the associated experiment.  (required)
 * @returns {Promise<Object>} Returns object containing the matched experiment.
 */
async function getExperimentByName(experiment_name) {
  if (!experiment_name) {
    throw new Error('Experiment name is required');
  }

  const url = `${MLFLOW_TRACKING_URI}/experiments/get-by-name?experiment_name=${experiment_name}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      `Error getting experiment by name from tracking server, status: ${response.status}.  ${errorBody.message}`
    );
  }

  const data = await response.json();
  // console.log('return from getExperimentByName: ', data.experiment);
  return data.experiment;
}
// test ****************************************************************************************************************************************
// getExperimentByName('test_experiment_postman16');
const testGetExperimentByName = async () => {
  const log = await getExperimentByName('test_experiment_postman16');
  console.log(log);
};
// uncomment below ---
// testGetExperimentByName();

/**
 * Mark an experiment for deletion.
 *
 * @param {string} experiment_id ID of the associated experiment.  (required)
 * @returns {string} Returns a string i.e. "Experiment ID 99999 successfully deleted"
 */
async function deleteExperiment(experiment_id) {
  if (!experiment_id) {
    throw new Error('Experiment ID is required');
  }

  const url = `${MLFLOW_TRACKING_URI}/experiments/delete`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ experiment_id }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      `Error deleting experiment from tracking server, status: ${response.status}.  ${errorBody.message}`
    );
  }

  // console.log(`Experiment ID ${experiment_id} successfully deleted`);
  return `Experiment ID ${experiment_id} successfully deleted`;
}

// test ****************************************************************************************************************************************
const testDeleteExperiment = async () => {
  const log = await deleteExperiment('993400766971093020');
  console.log(log);
  const log2 = await getExperiment('993400766971093020');
  console.log(log2);
  restoreExperiment('993400766971093020');
};
// uncomment below ---
// testDeleteExperiment();

/**
 * Restore an experiment marked for deletion.
 *
 * @param {string} experiment_id ID of the associated experiment.  (required)
 * @returns {string} Returns a string i.e. "Experiment ID 99999 successfully restored"
 */
async function restoreExperiment(experiment_id) {
  if (!experiment_id) {
    throw new Error('Experiment ID is required');
  }

  const url = `${MLFLOW_TRACKING_URI}/experiments/restore`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ experiment_id }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      `Error restoring experiment from tracking server, status: ${response.status}.  ${errorBody.message}`
    );
  }

  // console.log(`Experiment ID ${experiment_id} successfully restored`);
  return `Experiment ID ${experiment_id} successfully restored`;
}

// test ****************************************************************************************************************************************
const testRestoreExperiment = async () => {
  const log = await getExperiment('977566317259111173');
  console.log(log);
  const deleted = await deleteExperiment('977566317259111173');
  console.log(deleted);
  const log2 = await getExperiment('977566317259111173');
  console.log(log2);
  const log3 = await restoreExperiment('977566317259111173');
  console.log(log3);
  const log4 = await getExperiment('977566317259111173');
  console.log(log4);
};
// uncomment below ---
// testRestoreExperiment();

/**
 * Update experiment name.
 *
 * @param {string} experiment_id ID of the associated experiment. (required)
 * @param {string} new_name The experiment’s name is changed to the new name. The new name must be unique. (required)
 * @returns {string} Returns a string i.e. "Experiment ID 99999 successfully updated"
 */
async function updateExperiment(experiment_id, new_name) {
  if (!experiment_id) {
    throw new Error('Experiment ID is required');
  }
  if (!new_name) {
    throw new Error('New name is required');
  }

  const url = `${MLFLOW_TRACKING_URI}/experiments/update`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ experiment_id, new_name }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      `Error updating experiment from tracking server, status: ${response.status}.  ${errorBody.message}`
    );
  }

  // console.log(`Experiment ID ${experiment_id} successfully updated - new name is ${new_name}`);
  return `Experiment ID ${experiment_id} successfully updated - new name is ${new_name}`;
}

// test ****************************************************************************************************************************************
const testUpdateExperiment = async () => {
  const log = await getExperiment('668323101796317879');
  console.log(log);
  const log2 = await updateExperiment(
    '668323101796317879',
    'test_experiment_postman15_UPDATED_NAME'
  );
  console.log(log2);
  const log3 = await getExperiment('668323101796317879');
  console.log(log3);
  const revert = await updateExperiment(
    '668323101796317879',
    'test_experiment_postman15'
  );
};
// uncomment below ---
// testUpdateExperiment();

/**
 * Set a tag on an experiment.
 *
 * @param {string} experiment_id ID of the experiment under which to log the tag. (required)
 * @param {string} key Name of the tag.  (required)
 * @param {string} value String value of the tag being logged.  (required)
 * @returns {string} Returns a string, i.e. `Set tag to experiment ID 99999 successfully`
 */
async function setExperimentTag(experiment_id, key, value) {
  if (!experiment_id) {
    throw new Error('Experiment ID is required');
  }
  if (!key) {
    throw new Error('Key is required');
  }
  if (!value) {
    throw new Error('Value is required');
  }

  const url = `${MLFLOW_TRACKING_URI}/experiments/set-experiment-tag`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ experiment_id, key, value }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      `Error setting tag from tracking server, status: ${response.status}.  ${errorBody.message}`
    );
  }

  // console.log(`Set tag to experiment ID ${experiment_id} successfully`);
  return `Set tag to experiment ID ${experiment_id} successfully`;
}

// test ****************************************************************************************************************************************
const testSetExperimentTag = async () => {
  const log = await getExperiment('691149904576236192');
  console.log(log);
  console.log(log.tags);
  const log2 = await setExperimentTag(
    '691149904576236192',
    'test_tag',
    'test_value_TEST'
  );
  console.log(log2);
  const log3 = await getExperiment('691149904576236192');
  console.log(log3);
  console.log(log3.tags);
};
// uncomment below ---
// testSetExperimentTag();
