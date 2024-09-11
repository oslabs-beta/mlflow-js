interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  params?: Record<string, string>;
}

interface ApiResponse<T> {
  response: Response;
  data: T;
}

/**
 * Utility function for making API requests to the MLflow server.
 *
 * @param baseUrl - The base URL of the MLflow server
 * @param endpoint - The API endpoint
 * @param options - Request options
 * @returns A promise that resolves to the response and data
 */
async function apiRequest<T>(
  baseUrl: string,
  endpoint: string,
  options: RequestOptions
): Promise<ApiResponse<T>> {
  let url = `${baseUrl}/api/2.0/mlflow/${endpoint}`;
  const { method, body, params } = options;

  const fetchOptions: RequestInit = {
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
  const data = (await response.json()) as T;

  return { response, data };
}

export default apiRequest;
