import { describe, test, expect, beforeAll } from '@jest/globals';
import ExperimentClient from '../src/tracking/ExperimentClient';
import { ApiError } from '../src/utils/apiError';

describe('ExperimentClient', () => {
  let experimentClient: ExperimentClient;
  // let experimentId: string;

  beforeAll(async () => {
    // Add a small delay to ensure MLflow is fully ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
    experimentClient = new ExperimentClient('http://127.0.0.1:5001');

    // Generate the experiment ID to be used generically in later tests
    // const timestamp = Date.now();
    // experimentId = await experimentClient.createExperiment(`Testing ${timestamp}`);
  });

  describe('createExperiment', () => {
    test('should create an experiment and return the experiment ID', async () => {
      const timestamp = Date.now();
      const testExperimentId = await experimentClient.createExperiment(
        `Test experiment ${timestamp}`
      );
      expect(typeof testExperimentId).toBe('string');
      expect(testExperimentId).toBeTruthy();
    });

    xtest('should create an experiment, storing artifacts in the passed-in location', async () => {});

    xtest('should create an experiment with passed-in tags', async () => {});

    test('- Should throw errors if name is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.createExperiment()).rejects.toThrow(
        ApiError
      );
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.createExperiment()).rejects.toThrow(
        /Error creating experiment from tracking server:/
      );
    });

    test('- Should handle API errors', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(
        experimentClient.createExperiment(invalid_id)
      ).rejects.toThrow(ApiError);

      // the thrown error message with invalid_id somewhere in the message
      await expect(
        experimentClient.createExperiment(invalid_id)
      ).rejects.toThrow(
        /Error creating experiment from tracking server:.+invalid_id/
      );
    });
  });

  describe('searchExperiment', () => {
    beforeAll(async () => {
      const num1 = Math.random().toString().slice(2, 11);
      const name1 = `Search test ${num1}`;
      await experimentClient.createExperiment(name1);

      const num2 = Math.random().toString().slice(2, 11);
      const name2 = `Search test ${num2}`;
      await experimentClient.createExperiment(name2);

      const num3 = Math.random().toString().slice(2, 11);
      const name3 = `Search test ${num3}`;
      await experimentClient.createExperiment(name3);

      const num4 = Math.random().toString().slice(2, 11);
      const name4 = `Search test ${num4}`;
      await experimentClient.createExperiment(name4);

      const num5 = Math.random().toString().slice(2, 11);
      const name5 = `Search test ${num5}`;
      await experimentClient.createExperiment(name5);
    });

    test('should return', async () => {
      type searchResults = {
        experiment_id: string
        name: string
        artifact_location: string
        lifecycle_stage: string
        last_update_time: string
        creation_time: string
      };
      const results: {
        experiments?: searchResults[]
        next_page_token?: string
      } = await experimentClient.searchExperiment(
        "name LIKE 'Search test%'",
        4
      );
      
      expect(results.experiments).toBeDefined();
      expect(results.next_page_token).toBeDefined();
      expect(results.experiments).toHaveLength(4);
      results.experiments?.forEach(result => {
        expect(result).toHaveProperty('experiment_id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('artifact_location');
        expect(result).toHaveProperty('lifecycle_stage');
        expect(result).toHaveProperty('last_update_time');
        expect(result).toHaveProperty('creation_time');
      });
      const nextPageTokenIsString: boolean = typeof results.next_page_token === 'string'
      expect(nextPageTokenIsString).toBeTruthy;

      // could write add'l tests to expect name1, name2, name3, etc
    });

    test('- Should throw errors if name is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.createExperiment()).rejects.toThrow(
        ApiError
      );
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.createExperiment()).rejects.toThrow(
        /Error creating experiment from tracking server:/
      );
    });

    test('- Should handle API errors', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(
        experimentClient.createExperiment(invalid_id)
      ).rejects.toThrow(ApiError);

      // the thrown error message with invalid_id somewhere in the message
      await expect(
        experimentClient.createExperiment(invalid_id)
      ).rejects.toThrow(
        /Error creating experiment from tracking server:.+invalid_id/
      );
    });
  });
});
