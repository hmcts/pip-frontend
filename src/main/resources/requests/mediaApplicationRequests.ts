import { accountManagementApi } from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('requests');
export class MediaApplicationRequests {
  public async getMediaAccountById(applicationId): Promise<object | null> {
    try {
      const response = await accountManagementApi.get('/application/application/'+applicationId);
      logger.info('Application accessed - ' + applicationId, response);
      return response.data;
    }
    catch (error) {
      if (error.response) {
        logger.error('failed to create azure account on response', error.response.data);
      } else if (error.request) {
        logger.error('failed to create azure account on request', error.request);
      } else {
        logger.error('failed to create azure account with message', error.message);
      }
      return null;
    }
  }
}
