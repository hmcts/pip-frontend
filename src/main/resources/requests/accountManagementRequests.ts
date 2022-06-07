import {accountManagementApi, accountManagementApiUrl, getAccountManagementCredentials} from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';
import {MediaAccountApplication} from '../../models/MediaAccountApplication';

const superagent = require('superagent');
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

  public async getUserInfo(userProvenance: string, provenanceUserId: string): Promise<object> {
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

  public async createMediaAccount(form): Promise<boolean> {
    try {
      const token = await getAccountManagementCredentials();
      await superagent.post(`${accountManagementApiUrl}/application`)
        .set('enctype', 'multipart/form-data')
        .set({'Authorization': 'Bearer ' + token.access_token})
        .attach('file', form.file.body, form.file.name)
        .field('fullName', form.fullName)
        .field('email', form.email)
        .field('employer', form.employer)
        .field('status', form.status);
      return true;
    } catch (error) {
      if (error.response) {
        logger.error('failed to create media account on response', error.response.data);
      } else if (error.request) {
        logger.error('failed to create media account on request', error.request);
      } else {
        logger.error('failed to create media account with message', error.message);
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

  public async getPiUserByAzureOid(oid: string): Promise<string> {
    try {
      const response = await accountManagementApi.get(`/account/provenance/PI_AAD/${oid}`);
      return response.data.userId;
    } catch (error) {
      if (error.response) {
        logger.error('Failed to GET PI user request', error.response.data);
      } else if (error.request) {
        logger.error('Request failed for Pi user', error.request);
      } else {
        logger.error('Something went wrong trying to get the pi user from the oid', error.message);
      }
      return null;
    }
  }
}
