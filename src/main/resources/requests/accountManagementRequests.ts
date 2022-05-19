import { accountManagementApi } from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';
import {MediaAccountApplication} from '../../models/MediaAccountApplication';

const logger = Logger.getLogger('requests');
export class AccountManagementRequests {
  public async createAzureAccount(payload, requester): Promise<object | null> {
    try {
      const response = await accountManagementApi.post('/account/add/azure', payload, {headers: {'x-issuer-email': requester}});
      logger.info('azure account created', response);
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

  public async createPIAccount(payload, requester): Promise<boolean> {
    try {
      const response = await accountManagementApi.post('/account/add/pi', payload, {headers: {'x-issuer-email': requester}});
      logger.info('P&I account created', response);
      return response.status === 201;
    }
    catch (error) {
      if (error.response) {
        logger.error('failed to create admin P&I on response', error.response.data);
      } else if (error.request) {
        logger.error('failed to create admin P&I on request', error.request);
      } else {
        logger.error('failed to create admin P&I with message', error.message);
      }
      return false;
    }
  }

  public async getPendingMediaApplications(): Promise<MediaAccountApplication[]> {
    try {
      const response = await accountManagementApi.get('/application/status/PENDING');
      return response.data;
    } catch (error) {
      if (error.response) {
        logger.error('Failed to GET media application requests', error.response.data);
      } else if (error.request) {
        logger.error('Request failed for media applications', error.request);
      } else {
        logger.error('Something went wrong trying to get media applications', error.message);
      }
      return [];
    }
  }
}
