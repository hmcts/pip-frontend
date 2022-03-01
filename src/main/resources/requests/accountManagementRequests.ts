import {accountManagementApi} from './utils/axiosConfig';

//const superagent = require('superagent');

export class AccountManagementRequests {
  public accountManagementApi = process.env.ACCOUNT_MANAGEMENT_URL || 'https://pip-account-management.staging.platform.hmcts.net';

  public async uploadNewAccountRequest(body: any, headers: object): Promise<any> {
    try {
      const response = await accountManagementApi.post('/account/create', body, {headers});
      return response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(`Request failed. ${error.request}`);
      } else {
        console.log(`ERROR: ${error.message}`);
      }
    }
    return null;
  }
}
