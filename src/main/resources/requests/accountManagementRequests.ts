import { Application } from 'models/Application';

const superagent = require('superagent');

export class AccountManagementRequests {
  public accountManagementApi = process.env.ACCOUNT_MANAGEMENT_URL || 'https://pip-account-management.staging.platform.hmcts.net';

  public async uploadNewAccountRequest(body: any, headers: object): Promise<Application> {
    try {
      const response = await superagent.post(`${this.accountManagementApi}/application`)
        .set('enctype', 'multipart/form-data')
        .set(headers)
        .attach('file', body.file, body.fileName);
      return response.body;
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
