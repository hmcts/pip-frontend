import {accountManagementApi} from './utils/axiosConfig';
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

  public async getMediaApplicationById(applicationId): Promise<MediaAccountApplication | null> {
    try {
      const response = await accountManagementApi.get('/application/' + applicationId);
      logger.info('Media Application accessed - ' + applicationId, response);
      return response.data;
    }
    catch (error) {
      if (error.response) {
        logger.error('failed to retrieve media application', error.response.data);
      } else if (error.request) {
        logger.error('failed to retrieve media application', error.request);
      } else {
        logger.error('failed to retrieve media application', error.message);
      }
      return null;
    }
  }

  public async getMediaApplicationImageById(imageId): Promise<Blob> {
    try{
      const response = await accountManagementApi.get('/application/image/' + imageId, {responseType: 'arraybuffer'});
      logger.info('Media Application image access with ID - ' + imageId, response);
      return response.data;
    } catch (error) {
      if (error.response) {
        logger.error('failed to retrieve media application image - response', error.response.data);
      } else if (error.request) {
        logger.error('failed to retrieve media application image - request', error.request);
      } else {
        logger.error('failed to retrieve media application image - message', error.message);
      }
    }
    return null;
  }

  public async updateMediaApplicationStatus(applicantId, status): Promise<MediaAccountApplication | null> {
    try {
      const response = await accountManagementApi.put('/application/' + applicantId + '/' + status);
      logger.info('Media Application updated - ' + applicantId, response);
      return response.data;}
    catch (error) {
      if (error.response) {
        logger.error('failed to update media application', error.response.data);
      } else if (error.request) {
        logger.error('failed to update media application', error.request);
      } else {
        logger.error('failed to update media application', error.message);
      }
    }
    return null;
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
