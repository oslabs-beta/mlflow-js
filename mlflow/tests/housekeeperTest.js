import { MLflowHousekeeper } from '../src/workflows/MLflowHousekeeper';
import { ExperimentManagement } from '../src/tracking_server/experiment_management';
import { RunManagement } from '../src/tracking_server/run_management';
import { ModelRegistry } from '../src/model_registry/model_registry';
import { ModelVersionManagement } from '../src/model_registry/model_version_management';
import fs from 'fs';

jest.mock('../tracking_server/experiment_management');
jest.mock('../tracking_server/run_management');
jest.mock('../model_registry/model_registry');
jest.mock('../model_registry/model_version_management');
jest.mock('fs');

describe('MLflowHousekeeper', () => {
  let housekeeper;
  const trackingUri = 'http://localhost:5000';

  beforeEach(() => {
    housekeeper = new MLflowHousekeeper(trackingUri);
  });

  describe('datasetVersionControl', () => {
    it('successfully logs dataset version', async () => {
      const runId = 'run123';
      const datasetPath = '/data/dataset1.csv';
      const version = 'v1.0';
      const tags = { project: 'test' };

      RunManagement.prototype.logInputs = jest.fn().mockResolvedValue(true);

      const result = await housekeeper.datasetVersionControl(runId, datasetPath, version, tags);
      expect(RunManagement.prototype.logInputs).toHaveBeenCalledWith(runId, [{
        path: datasetPath,
        version: version,
        tags: tags
      }]);
      expect(result).toBeTruthy();
    });

    it('throws error when required parameters are missing', async () => {
      await expect(housekeeper.datasetVersionControl(null, null, null)).rejects.toThrow('Run ID, dataset path, and version are required.');
    });
  });

  describe('cleanupOldExperiments', () => {
    // Mock current time
    const mockCurrentTime = new Date('2023-01-01T00:00:00Z').getTime();
    jest.spyOn(global.Date, 'now').mockReturnValue(mockCurrentTime);

    it('cleans up old experiments', async () => {
      ExperimentManagement.prototype.searchExperiment = jest.fn().mockResolvedValue({
        experiments: [{
          experiment_id: 'exp1',
          last_update_time: new Date('2022-12-01T00:00:00Z').toISOString()
        }]
      });
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockImplementation(() => {});
      fs.writeFileSync.mockImplementation(() => {});
      RunManagement.prototype.logInputs = jest.fn().mockResolvedValue(true);
      ExperimentManagement.prototype.deleteExperiment = jest.fn().mockResolvedValue(true);

      await housekeeper.cleanupOldExperiments(30);
      expect(ExperimentManagement.prototype.deleteExperiment).toHaveBeenCalledWith('exp1');
    });
  });

  describe('deleteOldModelVersions', () => {
    it('deletes old model versions', async () => {
      ModelVersionManagement.prototype.searchModelVersions = jest.fn().mockResolvedValue([
        { version: '1', creation_timestamp: '100' },
        { version: '2', creation_timestamp: '200' },
        { version: '3', creation_timestamp: '300' },
        { version: '4', creation_timestamp: '400' }
      ]);
      ModelVersionManagement.prototype.deleteModelVersion = jest.fn().mockResolvedValue(true);

      await housekeeper.deleteOldModelVersions('TestModel', 'archived', 2);
      expect(ModelVersionManagement.prototype.deleteModelVersion).toHaveBeenCalledTimes(2);
      expect(ModelVersionManagement.prototype.deleteModelVersion).toHaveBeenCalledWith('TestModel', '1');
      expect(ModelVersionManagement.prototype.deleteModelVersion).toHaveBeenCalledWith('TestModel', '2');
    });
  });
});