/**
 * Utility function for making API requests to the MLflow server.
 *
 * @param {string} baseUrl - The base URL of the MLflow server
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {Object} [options.body] - Request body for POST, PUT, PATCH requests
 * @param {Object} [options.params] - URL parameters
 * @returns {Promise<Object>} - The response and data
 */
async function apiRequest(baseUrl, endpoint, options) {
  let url = `${baseUrl}/api/2.0/mlflow/${endpoint}`;
  const { method, body, params } = options;

  const fetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, fetchOptions);
  const data = await response.json();

  return { response, data };
}

export default apiRequest;
