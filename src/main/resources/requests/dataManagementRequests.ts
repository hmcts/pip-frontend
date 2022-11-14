import { dataManagementApi, getDataManagementCredentials } from './utils/axiosConfig';

const superagent = require('superagent');

export class DataManagementRequests {
  public dataManagementAPI =
    process.env.DATA_MANAGEMENT_URL || 'https://pip-data-management.staging.platform.hmcts.net';

  public async uploadPublication(body: any, headers: object): Promise<boolean> {
    const token = await getDataManagementCredentials();

    try {
      await superagent
        .post(`${this.dataManagementAPI}/publication`)
        .set('enctype', 'multipart/form-data')
        .set({ ...headers, Authorization: 'Bearer ' + token.access_token })
        .attach('file', body.file, body.fileName);
      return true;
    } catch (error) {
      if (error.response) {
        console.log('Failed to upload publication');
      } else if (error.request) {
        console.log('Request failed.');
      } else {
        console.log('Unknown error when attempting to upload publication');
      }
    }
    return false;
  }

  public async uploadJSONPublication(body: any, headers: object): Promise<boolean> {
    try {
      await dataManagementApi.post('/publication', body.file, { headers });
      return true;
    } catch (error) {
      if (error.response) {
        console.log('Failed to upload publication');
      } else if (error.request) {
        console.log('Request failed.');
      } else {
        console.log('Unknown error when attempting to upload publication');
      }
    }
    return false;
  }

  public async uploadLocationFile(body: any): Promise<boolean> {
    try {
      await superagent
        .post(`${this.dataManagementAPI}/locations/upload`)
        .set('enctype', 'multipart/form-data')
        .attach('locationList', body.file, body.fileName);
      return true;
    } catch (error) {
      if (error.response) {
        console.log('Failed to upload location data file');
      } else if (error.request) {
        console.log('Request failed.');
      } else {
        console.log('Unknown error when attempting to upload location data file');
      }
    }
    return false;
  }
}
