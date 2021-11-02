//import {dataManagementApi} from './utils/axiosConfig';
import fs from 'fs';
import path from 'path';

export class SearchDescriptionRequests {

  public async getStatusDescriptionList(): Promise<Array<any>> {
    try {
      //const response = await dataManagementApi.get('/courteventglossary');
      const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/StatusDescription.json'), 'utf-8');
      const courtStatusEvents = JSON.parse(rawData);
      return courtStatusEvents;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(`Request failed. ${error.request}`);
      } else {
        console.log(`ERROR: ${error.message}`);
      }
    }
    return [];
  }
}
