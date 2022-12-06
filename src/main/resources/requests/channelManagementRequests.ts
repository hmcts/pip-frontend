import {channelManagementApi} from './utils/axiosConfig';
import {Logger} from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('requests');

export class ChannelManagementRequests {
  /**
   * Request to channel management to retrieve the stored PDF and Excel files from Azure blob storage.
   * @param artefactId the artefact ID of the PDF and excel files in Azure blob storage.
   */
  public async getStoredFiles(artefactId): Promise<object | null> {
    try {
      const response = await channelManagementApi.get(`/publication/${artefactId}`);
      return response.data;
    }
    catch (error) {
      if (error.response) {
        logger.error('Failed to get stored files from blob storage on response');
      } else if (error.request) {
        logger.error('Failed to get stored files from blob storage on request');
      } else {
        logger.error('Failed to get stored files from blob storage with message');
      }
      return null;
    }
  }
}
