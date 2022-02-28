import { accountManagementApi } from './utils/axiosConfig';

const superagent = require('superagent');

export class AccountManagementRequests {

  public async uploadNewAccountRequest(body: any, headers: object): Promise<any> {
    try {
      const response = await superagent.post(`${accountManagementApi}account/create`)
        .set('enctype', 'multipart/form-data')
        .set(headers)
        .attach('file', body.file, body.fileName);
      response.data;
    }
    catch (error) {
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
