import { accountManagementApi } from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('requests');
export class AccountManagementRequests {
  public async createAdminAccount(payload, requester): Promise<boolean> {
    try {
      const response = await accountManagementApi.post('/account/add/azure', payload, {headers: {'x-issuer-email': requester}});
      logger.info('admin account created', response);
      return true;
    }
    catch (error) {
      if (error.response) {
        logger.error('failed to create admin account on response', error.response.data);
      } else if (error.request) {
        logger.error('failed to create admin account on request', error.request);
      } else {
        logger.error('failed to create admin account with message', error.message);
      }
      return false;
    }
  }
}
