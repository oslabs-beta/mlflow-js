import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import ExperimentClient from '../src/tracking/ExperimentClient';
import { ApiError } from '../src/utils/apiError';
import { Experiment } from '../src/utils/interface';

describe('ExperimentClient', () => {
  let experimentClient: ExperimentClient;
  let experimentId: string;
  let experimentName: string;
  const testIds: string[] = [];

  beforeAll(async () => {
    // Add a small delay to ensure MLflow is fully ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
    experimentClient = new ExperimentClient('http://127.0.0.1:5002');

    // Generate the experiment ID to be used generically in later tests
    const timestamp = Date.now();
    experimentName = `Testing ${timestamp}`;
    experimentId = await experimentClient.createExperiment(experimentName);
    testIds.push(experimentId);
  });

  describe('createExperiment', () => {
    test('should create an experiment and return the experiment ID', async () => {
      const timestamp = Date.now();
      const testExperimentId = await experimentClient.createExperiment(
        `Test experiment ${timestamp}`
      );
      testIds.push(testExperimentId);
      expect(typeof testExperimentId).toBe('string');
      expect(testExperimentId).toBeTruthy();
    });

    test('should throw error if name is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.createExperiment()).rejects.toThrow(
        ApiError
      );
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.createExperiment()).rejects.toThrow(
        /Error creating experiment from tracking server:/
      );
    });

    test('should throw error if name is already in use', async () => {
      await expect(
        experimentClient.createExperiment(experimentName)
      ).rejects.toThrow(ApiError);
    });
  });

  describe('searchExperiment', () => {
    beforeAll(async () => {
      for (let i = 0; i < 5; i++) {
        const num = Math.random().toString().slice(2, 11);
        const name = `Search test ${num}`;
        const search = await experimentClient.createExperiment(name);
        testIds.push(search);
      }
    });

    test('should return valid search results', async () => {
      const results: {
        experiments?: Experiment[];
        next_page_token?: string;
      } = await experimentClient.searchExperiment(
        "name LIKE 'Search test%'",
        4
      );

      expect(results.experiments).toBeDefined();
      expect(results.next_page_token).toBeDefined();
      expect(results.experiments).toHaveLength(4);
      results.experiments?.forEach((result) => {
        expect(result).toHaveProperty('experiment_id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('artifact_location');
        expect(result).toHaveProperty('lifecycle_stage');
        expect(result).toHaveProperty('last_update_time');
        expect(result).toHaveProperty('creation_time');
      });
      expect(typeof results.next_page_token).toBe('string');
    });
  });

  describe('getExperiment', () => {
    test('should return experiment information', async () => {
      const experiment = await experimentClient.getExperiment(experimentId);
      expect(experiment).toHaveProperty('experiment_id');
      expect(experiment).toHaveProperty('name');
      expect(experiment).toHaveProperty('artifact_location');
      expect(experiment).toHaveProperty('lifecycle_stage');
      expect(experiment).toHaveProperty('last_update_time');
      expect(experiment).toHaveProperty('creation_time');
    });

    test('should throw error if experiment ID is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.getExperiment()).rejects.toThrow(ApiError);
    });
  });

  describe('getExperimentByName', () => {
    test('should return experiment information', async () => {
      const experiment = await experimentClient.getExperimentByName(experimentName);
      expect(experiment).toHaveProperty('experiment_id');
      expect(experiment).toHaveProperty('name');
      expect(experiment).toHaveProperty('artifact_location');
      expect(experiment).toHaveProperty('lifecycle_stage');
      expect(experiment).toHaveProperty('last_update_time');
      expect(experiment).toHaveProperty('creation_time');
    });

    test('should throw error if experiment name is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.getExperimentByName()).rejects.toThrow(ApiError);
    });
  });

  describe('deleteExperiment', () => {
    test('should delete an experiment', async () => {
      const num = Math.random().toString().slice(2, 11);
      const name = `Test experiment ${num}`;
      const idToDelete = await experimentClient.createExperiment(name);
      await experimentClient.deleteExperiment(idToDelete);
      const results: {
        experiments?: Experiment[];
        next_page_token?: string;
      } = await experimentClient.searchExperiment(
        `name LIKE '${idToDelete}'`,
        4
      );
      expect(results).toEqual({});
    });

    test('should throw error if invalid experiment ID is passed in', async () => {
      await expect(experimentClient.deleteExperiment('invalidExperimentId')).rejects.toThrow(ApiError);
    });
  });

  describe('restoreExperiment', () => {
    test('should restore a deleted experiment', async () => {
      const num = Math.random().toString().slice(2, 11);
      const name = `Test experiment ${num}`;
      const idToDelete = await experimentClient.createExperiment(name);
      testIds.push(idToDelete);
      await experimentClient.deleteExperiment(idToDelete);
      await experimentClient.restoreExperiment(idToDelete);
      const results: {
        experiments?: Experiment[];
        next_page_token?: string;
      } = await experimentClient.searchExperiment(
        `name LIKE '${name}'`,
        4
      );
      expect(results.experiments).toBeDefined();
      expect(results.experiments).toHaveLength(1);
    });

    test('should throw error if invalid experiment ID is passed in', async () => {
      await expect(experimentClient.restoreExperiment('invalidExperimentId')).rejects.toThrow(ApiError);
    });
  });

  describe('updateExperiment', () => {
    test('should update an experiment\'s name', async () => {
      const num = Math.random().toString().slice(2, 11);
      const name = `Test experiment ${num}`;
      const exp = await experimentClient.createExperiment(name);
      testIds.push(exp);
      const updatedName = `${name}_UPDATE`
      await experimentClient.updateExperiment(exp, updatedName);
      const results: {
        experiments?: Experiment[];
        next_page_token?: string;
      } = await experimentClient.searchExperiment(
        `name LIKE '${updatedName}'`,
        4
      );
      expect(results.experiments).toBeDefined();
      expect(results.experiments).toHaveLength(1);
      expect(results.experiments?.[0].experiment_id).toBe(exp);
    });

    test('should throw error if invalid experiment ID is passed in', async () => {
      await expect(experimentClient.updateExperiment('invalidExperimentId', 'invalidExperimentIdUpdate')).rejects.toThrow(ApiError);
    });
  });

  describe('setExperimentTag', () => {
    test('should set a tag on an experiment', async () => {
      const num = Math.random().toString().slice(2, 11);
      const name = `Test experiment ${num}`;
      const exp = await experimentClient.createExperiment(name);
      testIds.push(exp);
      await experimentClient.setExperimentTag(exp, 'tag1', `value${num}`);
      const results: {
        experiments?: Experiment[];
        next_page_token?: string;
      } = await experimentClient.searchExperiment(
        `tags.tag1 = "value${num}"`,
        4
      );
      expect(results.experiments).toBeDefined();
      expect(results.experiments).toHaveLength(1);
      expect(results.experiments?.[0].experiment_id).toBe(exp);
    });

    test('should throw error if invalid experiment ID is passed in', async () => {
      await expect(experimentClient.setExperimentTag('invalidExperimentId', 'tag1', 'value1')).rejects.toThrow(ApiError);
    });
  });

  afterAll(async () => {
    while (testIds.length > 0) {
      const id = testIds.pop();
      if (id) {
        await experimentClient.deleteExperiment(id);
      }
    }
  });
});
