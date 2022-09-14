import {accountManagementApi, accountManagementApiUrl, getAccountManagementCredentials} from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';
import {MediaAccountApplication} from '../../models/MediaAccountApplication';
import moment from 'moment-timezone';

const superagent = require('superagent');
const logger = Logger.getLogger('requests');

export class AccountManagementRequests {

  /**
   * Request to account management that creates the azure account.
   * @param payload The payload containing the azure accounts to request.
   * @param requester The user ID of the person requesting this.
   */
  public async createAzureAccount(payload, requester): Promise<object | null> {
    try {
      const response = await accountManagementApi.post('/account/add/azure', payload, {headers: {'x-issuer-id': requester}});
      logger.info('Azure account created');
      return response.data;
    }
    catch (error) {
      if (error.response) {
        logger.error('Failed to create azure account on response');
      } else if (error.request) {
        logger.error('Failed to create azure account on request');
      } else {
        logger.error('Failed to create azure account with message');
      }
      return null;
    }
  }

  /**
   * Request to account management that creates a PI account.
   * @param payload The payload containing the azure accounts to request.
   * @param requester The user ID of the person requesting this.
   */
  public async createPIAccount(payload, requester): Promise<boolean> {
    try {
      const response = await accountManagementApi.post('/account/add/pi', payload, {headers: {'x-issuer-id': requester}});
      logger.info('P&I account created');
      return response.status === 201;
    }
    catch (error) {
      if (error.response) {
        logger.error('Failed to create admin P&I on response');
      } else if (error.request) {
        logger.error('Failed to create admin P&I on request');
      } else {
        logger.error('Failed to create admin P&I with message');
      }
      return false;
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
        logger.error('Failed to create media account on response');
      } else if (error.request) {
        logger.error('Failed to create media account on request');
      } else {
        logger.error('Failed to create media account with message');
      }
      return false;
    }
  }

  public async getMediaApplicationById(applicationId): Promise<MediaAccountApplication | null> {
    try {
      const response = await accountManagementApi.get('/application/' + applicationId);
      logger.info('Media Application accessed - ' + applicationId);
      return response.data;
    }
    catch (error) {
      if (error.response) {
        logger.error('Failed to retrieve media application', error.response.data);
      } else if (error.request) {
        logger.error('Failed to retrieve media application', error.request);
      } else {
        logger.error('Failed to retrieve media application', error.message);
      }
      return null;
    }
  }

  public async getMediaApplicationImageById(imageId): Promise<Blob> {
    try{
      const response = await accountManagementApi.get('/application/image/' + imageId, {responseType: 'arraybuffer'});
      logger.info('Media Application image access with ID - ' + imageId);
      return response.data;
    } catch (error) {
      if (error.response) {
        logger.error('Failed to retrieve media application image - response', error.response.data);
      } else if (error.request) {
        logger.error('Failed to retrieve media application image - request', error.request);
      } else {
        logger.error('Failed to retrieve media application image - message', error.message);
      }
    }
    return null;
  }

  public async updateMediaApplicationStatus(applicantId, status): Promise<MediaAccountApplication | null> {
    try {
      const response = await accountManagementApi.put('/application/' + applicantId + '/' + status);
      logger.info('Media Application updated - ' + applicantId);
      return response.data;}
    catch (error) {
      if (error.response) {
        logger.error('Failed to update media application', error.response.data);
      } else if (error.request) {
        logger.error('Failed to update media application', error.request);
      } else {
        logger.error('Failed to update media application', error.message);
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

  public async getPiUserByAzureOid(oid: string): Promise<any> {
    try {
      const response = await accountManagementApi.get(`/account/provenance/PI_AAD/${oid}`);
      return response.data;
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

  public async updateMediaAccountVerification(oid: string): Promise<string> {
    return this.updateAccountDate(oid, 'lastVerifiedDate', 'Failed to verify media account');
  }

  public async updateAccountLastSignedInDate(oid: string): Promise<string> {
    return this.updateAccountDate(oid, 'lastSignedInDate', 'Failed to update account last signed in date');
  }

  private async updateAccountDate(oid: string, field: string, errorMessage: string): Promise<string> {
    try {
      const map = {};
      map[field] = moment().tz('Europe/London').toISOString();
      const response = await accountManagementApi.put(`/account/provenance/PI_AAD/${oid}`, map);
      return response.data;
    } catch (error) {
      if (error.response) {
        logger.error(errorMessage, error.response.data);
      } else if (error.request) {
        logger.error(errorMessage, error.request);
      } else {
        logger.error(errorMessage, error.message);
      }
      return null;
    }
  }
}
