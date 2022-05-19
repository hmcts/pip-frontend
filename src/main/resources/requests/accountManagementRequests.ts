import { accountManagementApi } from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';

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

  public async isAuthorisedToViewList(userId: string, listType: string): Promise<boolean> {
    try {
      let requestUrl = null;
      if(userId) {
        requestUrl = `/account/isAuthorised/${userId}/${listType}`;
      } else {
        requestUrl = `/account/isAuthorised/${listType}`;
      }

      const response = await accountManagementApi.get(requestUrl);
      logger.info('Authorised user account', response);
      return response.data;
    }
    catch (error) {
      if (error.response) {
        logger.error('failed to get user authorisation for list on response', error.response.data);
      } else if (error.request) {
        logger.error('failed to get user authorisation for list on response', error.request);
      } else {
        logger.error('failed to get user authorisation for list on response', error.message);
      }
      return false;
    }
  }

  public async  getUserInfo(userProvenance: string, provenanceUserId: string): Promise<object> {
    try {
      const response = await accountManagementApi.get(`/account/provenance/${userProvenance}/${provenanceUserId}`);
      logger.info('Get user information from P&I database', response);
      return response.data;
    }
    catch (error) {
      if (error.response) {
        logger.error('failed to get user information from P&I database on response', error.response.data);
      } else if (error.request) {
        logger.error('failed to get user information from P&I database on response', error.request);
      } else {
        logger.error('failed to get user information from P&I database on response', error.message);
      }
      return null;
    }
  }
}
