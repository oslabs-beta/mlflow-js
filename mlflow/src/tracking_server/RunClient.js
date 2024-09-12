class RunClient {
  constructor(trackingUri) {
    this.trackingUri = trackingUri;
  }

  /**
   * Create a new run within an experiment. A run is usually a single execution of a machine learning or data ETL pipeline. MLflow uses runs to track Param, Metric, and RunTag associated with a single execution.
   *
   * @param {string} experiment_id - ID of the associated experiment. (required)
   * @param {string} [run_name] - Name of the run.
   * @param {number} [start_time] - Unix timestamp in milliseconds of when the run started.
   * @param {Array<{key: string, value: string}>} [tags=[]] - Additional metadata for the run.
   * @returns {Promise<Object>} - A promise that resolves with the created run object.
   */
  async createRun(
    experiment_id,
    run_name = null,
    start_time = null,
    tags = []
  ) {
    if (!experiment_id) {
      throw new Error('Experiment ID is required');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/create`;

    const body = {
      experiment_id,
      start_time: start_time !== null ? start_time : Date.now(),
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
        `Error creating run: ${data.message || response.statusText}`
      );
    }

    return data.run;
  }

  /**
   * Mark a run for deletion.
   *
   * @param {string} run_id - ID of the run to delete. (required)
   * @returns {Promise<void>} - A promise that resolves when the run is deleted.
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
      throw new Error(`Error deleting run: ${response.statusText}`);
    }
  }

  /**
   * Restore a deleted run.
   *
   * @param {string} run_id - ID of the run to restore. (required)
   * @returns {Promise<void>} - A promise that resolves when the run is restored.
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
      throw new Error(`Error restoring run: ${response.statusText}`);
    }
  }

  /**
   * Get metadata, metrics, params, and tags for a run. In the case where multiple metrics with the same key are logged for a run, return only the value with the latest timestamp. If there are multiple values with the latest timestamp, return the maximum of these values.
   *
   * @param {string} run_id - ID of the run to fetch. (required)
   * @returns {Promise<Object>} - A promise that resolves with the fetched run object.
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
        `Error fetching run: ${data.message || response.statusText}`
      );
    }

    return data.run;
  }

  /**
   * Update run metadata.
   *
   * @param {string} run_id - ID of the run to update. (required)
   * @param {string} [status] - Updated status of the run.
   * @param {number} [end_time] - Unix timestamp in milliseconds of when the run ended.
   * @param {string} [run_name] - Updated name of the run.
   * @returns {Promise<Object>} - A promise that resolves with the updated metadata of the run object.
   */
  async updateRun(run_id, status = null, end_time = null, run_name = null) {
    if (!run_id) {
      throw new Error('Run ID is required.');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/update`;

    const body = { run_id };
    if (status) body.status = status;
    if (end_time) body.end_time = end_time;
    if (run_name) body.run_name = run_name;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error updating run: ${data.message || response.statusText}`
      );
    }

    return data;
  }

  /**
   * Log a metric for a run. A metric is a key-value pair (string key, float value) with an associated timestamp. Examples include the various metrics that represent ML model accuracy. A metric can be logged multiple times.
   *
   * @param {string} run_id - ID of the run under which to log the metric. (required)
   * @param {string} key - Name of the metric. (required)
   * @param {number} value - Double value of the metric being logged. (required)
   * @param {number} timestamp - Unix timestamp in milliseconds at the time metric was logged. (required)
   * @param {number} [step=0] - Step at which to log the metric.
   * @returns {Promise<void>} - A promise that resolves when the logging is complete.
   */

  async logMetric(run_id, key, value, timestamp = Date.now(), step = 0) {
    if (!run_id || !key || !value || !timestamp) {
      throw new Error('Run ID, key, value, and timestamp are required.');
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
      throw new Error(`Error logging metric: ${response.statusText}`);
    }
  }

  /**
   * Log a batch of metrics, params, and tags for a run. If any data failed to be persisted, the server will respond with an error (non-200 status code). In case of error (due to internal server error or an invalid request), partial data may be written.
   *
   * @param {string} run_id - ID of the run to log under. (required)
   * @param {Array<{key: string, value: number, timestamp: number, step?: number}>} [metrics=[]] - Metrics to log. A single request can contain up to 1000 metrics, and up to 1000 metrics, params, and tags in total.
   * @param {Array<{key: string, value: string}>} [params=[]] - Params to log. A single request can contain up to 100 params, and up to 1000 metrics, params, and tags in total.
   * @param {Array<{key: string, value: string}>} [tags=[]] - Tags to log. A single request can contain up to 100 tags, and up to 1000 metrics, params, and tags in total.
   * @returns {Promise<void>} - A promise that resolves when the logging is complete.
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
      throw new Error(`Error logging batch: ${response.statusText}`);
    }
  }

  /**
   * Logs a model.
   *
   * @param {string} run_id - ID of the run to log under. (required)
   * @param {string} model_json - MLmodel file in json format. (required)
   * @returns {Promise<Void>} - A promise that resolves when the logging is complete.
   */
  async logModel(run_id, model_json) {
    if (!run_id || model_json) {
      throw new Error('Run ID and MLmodel data are required.');
    }

    const url = `${this.trackingUri}/api/2.0/mlflow/runs/log-model`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ run_id, model_json }),
    });

    if (!response.ok) {
      throw new Error(`Error logging model: ${response.statusText}`);
    }
  }

  /**
   * Logs inputs.
   *
   * @param {string} run_id - ID of the run to log under. (required)
   * @param {Array<Object>} datasets - The dataset inputs in JSON format. (required)
   * @returns {Promise<void>} - A promise that resolves when the logging is complete.
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
  }

  /**
   * Set a tag on a run. Tags are run metadata that can be updated during a run and after a run completes.
   *
   * @param {string} run_id - ID of the run under which to log the tag. (required)
   * @param {string} key - Name of the tag. Maximum size depends on storage backend. All storage backends
   * are guaranteed to support key values up to 250 bytes in size. (required)
   * @param {string} value - String value of the tag being logged. Maximum size depends on storage
   * backend. All storage backends are guaranteed to support key values up to 5000 bytes in size. (required)
   * @returns {Promise<Void>} - A promise that resolves when the logging is complete.
   */
  async setTag(run_id, key, value) {
    if (!run_id) {
      throw new Error('Run ID is required');
    } else if (!key) {
      throw new Error('Key is required');
    } else if (!value) {
      throw new Error('Value is required');
    }
    const url = `${this.trackingUri}/api/2.0/mlflow/runs/set-tag`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ run_id, key, value }),
    });

    if (!response.ok) {
      throw new Error(`Error setting tag: ${response.statusText}`);
    }
  }

  /**
   * Delete a tag on a run. Tags are run metadata that can be updated during a run and after a run completes.
   *
   * @param {string} run_id - ID of the run that the tag was logged under. (required)
   * @param {string} key - Name of the tag. Maximum size is 255 bytes. (required)
   * @returns {Promise<Void>} - A promise that resolves when the deletion is complete.
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
      throw new Error(
        `Error logging param: ${data.message || response.statusText}`
      );
    }
    return data;
  }

  /**
   * Log a param used for a run. A param is a key-value pair (string key, string value). Examples include hyperparameters used for ML model training and constant dates and values used in an ETL pipeline. A param can be logged only once for a run.
   *
   * @param {string} run_id - ID of the run under which to log the param. (required))
   * @param {string} key - Name of the param. Maximum size is 255 bytes. (required)
   * @param {string} value  - String value of the param being logged. Maximum size is 6000 bytes. (required)
   * @returns {Promise<Void>} - A promise that resolves when the logging is complete.
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

    if (!response.ok) {
      throw new Error(`Error logging param: ${response.statusText}`);
    }
  }

  /**
   * Get a list of all values for the specified metric for a given run.
   *
   * @param {string} run_id - ID of the run from which to fetch metric values. (required)
   * @param {string} metric_key - Name of the metric. (required)
   * @param {string} page_token - Token indicating the page of metric history to fetch.
   * @param {INT32} max_results - Maximum number of logged instances of a metric for a run to return per call.
   * Backend servers may restrict the value of max_results depending on performance requirements. Requests that do not
   * specify this value will behave as non-paginated queries where all metric history values for a given metric
   * within a run are returned in a single response.
   * @returns {Promise<Object>} - A promise that resolves with the values for the specified metric.
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
   * @returns {Promise<Object} - A promise that resovles with the runs that match the search criteria.
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
   * List artifacts for a run. Takes an optional artifact_path prefix which if specified, the response contains only artifacts with the specified prefix.
   *
   * @param {string} run_id - ID of the run whose artifacts to list. (required)
   * @param {string} artifact_path - Filter artifacts matching this path (a relative path from the root artifact directory).
   * @param {string} page_token  - Token indicating the page of artifact results to fetch.
   * @returns {Promise<Object>} - A promise that resolves with a list artifacts for the specified run.t
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

export { RunClient };
