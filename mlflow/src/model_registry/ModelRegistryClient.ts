import apiRequest from '../utils/ApiRequest';

class ModelRegistryClient {
  private baseUrl: string;

  constructor(trackingUri: string) {
    this.baseUrl = trackingUri;
  }

  /**
   * Creates a new registered model.
   *
   * @param name - The name of the model to register (required)
   * @param tags - Optional An array of RegisteredModelTag. Each tag is an object with 'key' and 'value' properties.
   * @param description - Optional description for the model
   * @returns The created registered model object
   * @throws Error - If the API request fails
   */
  async createRegisteredModel(
    name: string,
    tags: Array<{ key: string; value: string }> = [],
    description: string = ''
  ): Promise<any> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/create',
      {
        method: 'POST',
        body: { name, tags, description },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error creating registered model: ${
          data.message || response.statusText
        }`
      );
    }

    return data.registered_model;
  }

  /**
   * Gets a registered model.
   *
   * @param name - The name of the registered model to retrieve (required)
   * @returns The registered model object
   */
  async getRegisteredModel(name: string): Promise<any> {
    const { response, data } = await apiRequest(
      this.baseUrl,
      'registered-models/get',
      {
        method: 'GET',
        params: { name },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error getting registered model: ${data.message || response.statusText}`
      );
    }
    return data.registered_model;
  }
}

export default ModelRegistryClient;
