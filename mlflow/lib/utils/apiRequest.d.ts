interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: Record<string, unknown>;
    params?: Record<string, string>;
}
interface ApiResponse<T = any> {
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
export declare function apiRequest<T = any>(baseUrl: string, endpoint: string, options: RequestOptions): Promise<ApiResponse<T>>;
export {};
