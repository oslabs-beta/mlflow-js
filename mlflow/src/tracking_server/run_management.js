class RunManagement {
  constructor(trackingUri, path) {
    this.trackingUri = trackingUri;
    this.path = path;
  }

  /**
   * Creates a new run.
   *
   * @param {string} experiment_id - The ID of the associated experiment (required)
   * @param {string} [run_name] - The name of the run (optional)
   * @param {Array<{key: string, value: string}>} [tags=[]] - Additional metadata for the run (optional)
   * @returns {Promise<Object>} - The created run object
   */
  async createRun(experiment_id, run_name = null, tags = []) {
    if (!experiment_id) {
      throw new Error('Experiment ID is required');
    }

    const startTime = Date.now();

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/create`;

    const body = {
      experiment_id,
      start_time: startTime,
      tags,
    };

    if (run_name) {
      body.run_name = run_name;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error in creating run: ${data.message || response.statusText}`
      );
    }

    return data.run;
  }

  /**
   * Deletes a run.
   *
   * @param {string} run_id - The ID of the run to delete (required)
   * @returns {Promise<void>} - A promise that resolves when the run is deleted
   */
  async deleteRun(run_id) {
    if (!run_id) {
      throw new Error('Run ID is required.');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/delete`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ run_id }),
    });

    if (!response.ok) {
      throw new Error(`Error in deleting run: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Restores a run.
   *
   * @param {string} run_id - The ID of the run to restore (required)
   * @returns {Promise<void>} - A promise that resolves when the run is restored
   */
  async restoreRun(run_id) {
    if (!run_id) {
      throw new Error('Run ID is required.');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/restore`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ run_id }),
    });

    if (!response.ok) {
      throw new Error(`Error in restoring run: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Fetches a run.
   *
   * @param {string} run_id - The ID of the run to fetch (required)
   * @returns {Promise<Object>} - The fetched run object
   */
  async getRun(run_id) {
    if (!run_id) {
      throw new Error('Run ID is required.');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/get?run_id=${run_id}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error in fetching run: ${data.message || response.statusText}`
      );
    }

    return data.run;
  }

  /**
   * updates a run.
   *
   * @param {string} run_id - The ID of the run to update (required)
   * @param {string} [status] - The status of the updated run (optional)
   * @param {string} [run_name] - The updated name of the run (optional)
   * @param {number} [end_time] - The end time fo the run in milliseconds since epoch (optional)
   * @returns {Promise<Object>} - The updated metadata of the run object
   */
  async updateRun(run_id, status = null, run_name = null, end_time = null) {
    if (!run_id) {
      throw new Error('Run ID is required.');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/update`;

    const body = { run_id };
    if (status) body.status = status;
    if (run_name) body.run_name = run_name;
    if (end_time) body.end_time = end_time;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error in updating run: ${data.message || response.statusText}`
      );
    }

    return data;
  }

  /**
   * Logs a metric for a run.
   *
   * @param {string} run_id - The ID of the run under which to log the metric (required)
   * @param {string} key - The name of the metric (required)
   * @param {number} value - The double value of the metric being logged (required)
   * @param {number} timestamp - The unix timestamp in milliseconds at the time metric was logged (required)
   * @param {number} [step=0] - The step at which to log the metric (optional)
   * @returns {Promise<void>} - A promise that resolves when the metric is logged
   */

  async logMetric(run_id, key, value, timestamp = Date.now(), step = 0) {
    if (!run_id || !key || !value) {
      throw new Error('Run ID, key, value, timestamp are required.');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/log-metric`;

    const body = { run_id, key, value, timestamp };
    if (step) body.step = step;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error in logging metric: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Logs a batch of metrics, params, and tags for a run.
   *
   * @param {string} run_id - The ID of the run to log under (required)
   * @param {Array<{key: string, value: number, timestamp: number, step?: number}>} [metrics] - The metrics to log (up to 1000 metrics) (optional)
   * @param {Array<{key: string, value: string}>} [params] - The params to log (up to 100 params) (optional)
   * @param {Array<{key: string, value: string}>} [tags=[]] - The tags to log (up to 100 tags) (optional)
   * @returns {Promise<void>} - A promise that resolves when the logging is complete
   */
  async logBatch(run_id, metrics = [], params = [], tags = []) {
    if (!run_id) {
      throw new Error('Run ID is required.');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/log-batch`;

    const body = { run_id };
    if (metrics) body.metrics = metrics;
    if (params) body.params = params;
    if (tags) body.tags = tags;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const responseBody = await response.text();
      console.error(`Response body: ${responseBody}`);
      throw new Error(`Error in logging batch: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Logs a model.
   *
   * @param {string} run_id - The ID of the run to log under (required)
   * @param {string} model_json - The MLmodel data in JSON format (required)
   * @returns {Promise<Object>} - A promise that resolves when the model is successfully logged
   */
  async logModel(run_id, model_json) {
    if (!run_id || !model_json) {
      throw new Error('Run ID and MLmodel file are required.');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/log-model`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ run_id, model_json }),
    });

    if (!response.ok) {
      throw new Error(`Error in logging model: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Logs inputs.
   *
   * @param {string} run_id - The ID of the run to log under (required)
   * @param {Array<Object>} datasets - The dataset inputs in JSON format (required)
   * @returns {Promise<void>} - A promise that resolves when the logging is complete
   */

  async logInputs(run_id, datasets) {
    if (!run_id || !datasets) {
      throw new Error('Run ID and datasets are required.');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/log-inputs`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ run_id, datasets }),
    });

    if (!response.ok) {
      throw new Error(`Error in logging inputs: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   *
   * @param {string} run_id - ID of the run which to log the tag. Required
   * @param {string} key - Name of the tag. Maximum size depends on storage backend. All storage backends
   * are guaranteed to support key values up to 250 bytes in size. Required
   * @param {string} value - String value of the tag being logged. Maximum size depends on storage
   * backend. All storage backends are guaranteed to support key values up to 5000 bytes in size. Required
   * @returns {Promise<Object} - Empty promise object
   */
  async setTag(run_id, key, value) {
    if (!run_id) {
      throw new Error('run_id is required');
    } else if (!key) {
      throw new Error('key is required');
    } else if (!value) {
      throw new Error('value is required');
    }
    const url = `${this.trackingUri}/api/2.0/mlflow/runs/set-tag`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ run_id, key, value }),
    });

    // data is an empty object
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error logging param: ${response.statusText}`);
    }
    return data;
  }

  /**
   *
   * @param {string} run_id - ID of the run that the tag was logged under. Required
   * @param {string} key - Name of the tag. Maximum size is 255 bytes. Required
   * @returns {Promise<Void>} - Empty promise object
   */
  async deleteTag(run_id, key) {
    if (!run_id) {
      throw new Error('run_id is required');
    } else if (!key) {
      throw new Error('key is required');
    }
    const url = `${this.trackingUri}/api/2.0/mlflow/runs/delete-tag`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ run_id, key }),
    });

    // data is an empty object
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error logging param: ${response.statusText}`);
    }
    return data;
  }

  /**
   *
   * @param {string} run_id - ID of the run under which to log the param. Required
   * @param {string} key - Name of the param. Maximum size is 255 bytes. Required
   * @param {string} value  - String value of the param being logged. Maximum size is 6000 bytes. Required
   * @returns {Promise<Void>} - Empty promise object
   * Note: A param can be logged only once for a run
   */
  async logParam(run_id, key, value) {
    if (!run_id) {
      throw new Error('run_id is required');
    } else if (!key) {
      throw new Error('key is required');
    } else if (!value) {
      throw new Error('value is required');
    }
    const url = `${this.trackingUri}/api/2.0/mlflow/runs/log-parameter`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ run_id, key, value }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Error logging param: ${response.statusText}`);
    }
    return data;
  }

  /**
   *
   * @param {string} run_id - ID of the run from which to fetch metric values. Required
   * @param {string} metric_key - Name of the metric. Required
   * @param {string} page_token - Token indicating the page of metric history to fetch
   * @param {INT32} max_results - Maximum number of logged instances of a metric for a run to return per call.
   * Backend servers may restrict the value of max_results depending on performance requirements. Requests that do not
   * specify this value will behave as non-paginated queries where all metric history values for a given metric
   * within a run are returned in a single response.
   * @returns {Promise<Void>} - The values for the specified metric, as a promise object
   */
  async getMetricHistory(run_id, metric_key, page_token, max_results) {
    if (!run_id) {
      throw new Error('run_id is required');
    } else if (!metric_key) {
      throw new Error('metric_key is required');
    }
    const url = `${this.trackingUri}/api/2.0/mlflow/metrics/get-history?run_id=${run_id}&metric_key=${metric_key}&page_token=${page_token}&max_results=${max_results}`;
    const response = await fetch(url);
    /**
     * data can have the fields:
     * metrics {An array of Metric} - All logged values for this metric
     * next_page_token {string} - Token that can be used to issue a query for the next page of metric history values. A
     * missing token indicates that no additional metrics are available to fetch.
     */
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        `Error finding metric for given run: ${
          data.message || response.statusText
        }`
      );
    }

    return data;
  }

  /**
   *
   * @param {Array<{key: string, value: string}>} experiment_ids - List of experiment IDs to search over.
   * @param {string} filter - A filter expression over params, metrics, and tags, that allows returning a subset of runs.
   * The syntax is a subset of SQL that supports ANDing together binary operations between a param, metric, or tag and a constant.
   * Example: metrics.rmse < 1 and params.model_class = 'LogisticRegression'
   * You can select columns with special characters (hyphen, space, period, etc.) by using
   * double quotes: metrics."model class" = 'LinearRegression' and tags."user-name" = 'Tomas'
   * Supported operators are =, !=, >, >=, <, and <=.
   * @param {ViewType} run_view_type - Whether to display only active, only deleted, or all runs. Defaults to active runs.
   * @param {INT32} max_results  - Maximum number of runs desired. If unspecified, defaults to 1000. All servers are
   * guaranteed to support a max_results theshold of at least 50,000 but may support more. Callers of this endpoint are
   * encouraged to pass max_results explicitly and leverage page_token to iterate through experiments.
   * @param {Array<{key: string, value: string}>} order_by - List of columns to be ordered by, including attributes, params, metrics,
   * and tags with an optional "DESC" or "ASC" annotation, where "ASC" is the default.
   * Example: ["params.input DESC","metrics.alpha ASC", "metrics.rmse"] Tiebreaks are done by start_time DESC followed by run_id for
   * runs with the same start time (and this is the default ordering criterion if order_by is not provided).
   * @param {string} page_token
   * @returns {Promise<Object} - The runs that satisfy the expressions, as a promise object
   */
  async searchRuns(
    experiment_ids,
    filter,
    run_view_type,
    max_results,
    order_by,
    page_token
  ) {
    const url = `${this.trackingUri}/api/2.0/mlflow/runs/search`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        experiment_ids,
        filter,
        run_view_type,
        max_results,
        order_by,
        page_token,
      }),
    });
    /**
     * data can have the fields:
     * runs {An array of Run} - Runs that match the search criteria
     * next_page_token {string} - Token that can be used to retrieve the next page of run results. A missing token indicates
     * that there are no additional run results to be fetched.
     */
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        `Error finding run that satisfies expressions: ${
          data.message || response.statusText
        }`
      );
    }

    return data;
  }

  /**
   *
   * @param {string} run_id - ID of the run whose artifacts to list. Required
   * @param {string} artifact_path - Filter artifacts matching this path (a relative path from the root artifact directory). Not required
   * @param {string} page_token  - Token indicating the page of artifact results to fetch. Not required
   * @returns {Promise<Object>} - The list artifacts for the specified run, as a promise object
   */
  async listArtifacts(run_id, artifact_path = '', page_token = '') {
    if (!run_id) {
      throw new Error('run_id is required');
    }
    const response = await fetch(
      `${this.trackingUri}/api/2.0/mlflow/artifacts/list?run_id=${run_id}&run_uuid=${run_id}&path=${artifact_path}&page_token=${page_token}`
    );
    /**
     * data can have the fields:
     * root_uri {string} - Root artifact directory for the run
     * files {An array of FileInfo} - File location and metadata for artifacts
     * next_page_token {string} - Token that can be used to retrieve the next page of artifact results. A missing token indicates
     * that there are no additional artifact results to be fetched.
     */
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        `Error retrieving artifacts from run: ${
          data.message || response.statusText
        }`
      );
    }

    return data;
  }
}

export { RunManagement };
