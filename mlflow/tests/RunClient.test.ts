import { describe, test, expect, beforeEach, it } from '@jest/globals';
import request from 'supertest';
import RunClient from '../src/tracking/RunClient';
import { ApiError } from '../src/utils/apiError';

const baseUrl = 'http://127.0.0.1:5000';

interface Run {
  info: {
    run_id: string;
    run_name: string;
    experiment_id: string;
    status: string;
    start_time: number;
    end_time: number;
    artifact_uri: string;
    lifecycle_stage: string;
  };
  data: {
    metrics: Array<{ key: string; value: number }>;
    params: Array<{ key: string; value: number }>;
    tags: Array<{ key: string; value: number }>;
  };
  inputs: Array<{
    tags?: Array<{ key: string; value: string }>;
    dataset: {
      name: string;
      digest: string;
      source_type: string;
      source: string;
      schema?: string;
      profile?: string;
    };
  }>;
}

describe('RunClient', () => {
  let client: RunClient;

  beforeEach(() => {
    client = new RunClient('http://127.0.0.1:5000');
  });

  describe('createRun', () => {
    // POST - Create a new run within an experiment
    test('- Should create a run with experiment_id', async () => {
      const experiment_id = '876374673578277025';

      const response = (await client.createRun(experiment_id)) as Run;

      expect(response.info.experiment_id).toBe(experiment_id);
    });

    test('- Should create a run with optional run_name', async () => {
      const experiment_id = '876374673578277025';
      const run_name = 'Test Run 1';

      const response = (await client.createRun(experiment_id, run_name)) as Run;

      expect(response.info.run_name).toBe(run_name);
      expect(response.data.tags).toContainEqual({
        key: 'mlflow.runName',
        value: run_name,
      });
    });

    test('- Should create a run with optional tags', async () => {
      const experiment_id = '876374673578277025';
      const tags = [
        { key: 'test_key1', value: 'test_value1' },
        { key: 'test_key2', value: 'test_value2' },
      ];

      const response = (await client.createRun(
        experiment_id,
        undefined,
        undefined,
        tags
      )) as Run;

      expect(response.data).toHaveProperty('tags');
      tags.forEach((tag) => {
        expect(response.data.tags).toContainEqual(tag);
      });
    });

    test('- Should create a run with all parameters', async () => {
      const experiment_id = '876374673578277025';
      const run_name = 'Test Run 2';
      const start_time = Date.now();
      const tags = [{ key: 'test_key', value: 'test_value' }];

      const response = (await client.createRun(
        experiment_id,
        run_name,
        start_time,
        tags
      )) as Run;

      expect(response.info.experiment_id).toBe(experiment_id);
      expect(response.info.run_name).toBe(run_name);
      expect(response.info.start_time).toBe(start_time);
      expect(response.data.tags).toContainEqual(tags[0]);
    });

    test('- Should handle API errors', async () => {
      const invalid_id = 'invalid_id';

      // the thrown error is specifically an instance of 'ApiError'
      await expect(client.createRun(invalid_id)).rejects.toThrow(ApiError);

      // the thrown error message with invalid_id somewhere in the message
      await expect(client.createRun(invalid_id)).rejects.toThrow(
        /Error creating run:.+invalid_id/
      );
    });
  });
});

describe('MLflow API Integration Tests', () => {
  it('- Should create a run using direct API call', async () => {
    const experiment_id = '876374673578277025';
    const run_name = 'Test Run';

    const response = await request(baseUrl)
      .post('/api/2.0/mlflow/runs/create')
      .send({ experiment_id, run_name })
      .expect(200);

    expect(response.body).toHaveProperty('run');
    expect(response.body.run.info.experiment_id).toBe(experiment_id);
    expect(response.body.run.info.run_name).toBe(run_name);
  });
});
