import {accountManagementApi, accountManagementApiUrl, getAccountManagementCredentials} from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';

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

  public async createMediaAccount(form): Promise<boolean> {
    try {
      const token = await getAccountManagementCredentials();
      await superagent.post(`${accountManagementApiUrl}application`)
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
}
