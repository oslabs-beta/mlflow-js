import { RunManagement } from '../tracking_server/run_management.js';

class Abstraction {
  constructor(trackingUri) {
    this.trackingUri = trackingUri;
    this.RunManagement = new RunManagement(this.trackingUri);
  }

  /**
   * Delete runs that do not meet certain criteria and return the deleted runs.
   *
   * @param {string[]} experimentIds - The IDs of the associated experiments. (required)
   * @param {string} queryString - SQL-like query string to filter runs to keep. (required)
   * @param {boolean} [dryRun=true] - If true, only simulate the deletion. Defaults to true. (optional)
   * @returns {Promise<Object>} - An object of deleted runs.
   */
  async runCleanup(experimentIds, queryString, dryRun = true) {
    const deletedRuns = [];
    let pageToken = null;
    const maxResults = 1000;

    try {
      do {
        // get all runs
        const searchResult = await this.RunManagement.searchRuns(
          experimentIds,
          '',
          null, // run_view_type
          maxResults,
          ['start_time DESC'],
          pageToken
        );

        // get runs that match the keep crteria
        const keepResult = await this.RunManagement.searchRuns(
          experimentIds,
          queryString,
          null, // run_view_type
          maxResults,
          ['start_time DESC'],
          pageToken
        );

        // create a Set of run IDs to keep for efficient lookup
        const keepRunIds = new Set(
          keepResult.runs.map((run) => run.info.run_id)
        );

        // check for runs that are not in keepRunIds
        // if dryRun is false, delete from database, push to deletedRuns array
        // if dryRun is true, push to deletedRuns array
        for (const run of searchResult.runs || []) {
          if (!keepRunIds.has(run.info.run_id)) {
            if (!dryRun) {
              await this.RunManagement.deleteRun(run.info.run_id);
            }
            deletedRuns.push(run);
          }
        }

        pageToken = searchResult.page_token;
      } while (pageToken);
    } catch (error) {
      console.error('Error during run cleanup: ', error);
      throw new Error('Failed to cleanup runs.');
    }
    return { deletedRuns, total: deletedRuns.length, dryRun };
  }
}

export { Abstraction };
