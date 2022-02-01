const superagent = require('superagent');

export class DataManagementRequests {
  public async uploadPublication(body: any, headers: object): Promise<boolean> {
    try {
      const dataManagementAPI = process.env.DATA_MANAGEMENT_URL || 'https://pip-data-management.staging.platform.hmcts.net/';
      const response = await superagent.post(`${dataManagementAPI}publication`)
        .set('enctype', 'multipart/form-data')
        .set(headers)
        .attach('file', body.file, body.fileName);
      console.log('response', response);
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
