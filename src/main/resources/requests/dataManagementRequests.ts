import { dataManagementApi } from './utils/axiosConfig';

const superagent = require('superagent');

export class DataManagementRequests {
  public dataManagementAPI = process.env.DATA_MANAGEMENT_URL || 'https://pip-data-management.staging.platform.hmcts.net/';

  public async uploadPublication(body: any, headers: object): Promise<boolean> {
    try {
      await superagent.post(`${this.dataManagementAPI}publication`)
        .set('enctype', 'multipart/form-data')
        .set(headers)
        .attach('file', body.file, body.fileName);
      return true;
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
    return false;
  }

  public async uploadJSONPublication(body: any, headers: object): Promise<boolean> {
    try {
      await dataManagementApi.post('/publication', body, headers);
      return true;
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
    return false;
  }
}
