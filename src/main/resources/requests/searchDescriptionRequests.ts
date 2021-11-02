import {dataManagementApi} from './utils/axiosConfig';

export class SearchDescriptionRequests {

  public async getStatusDescriptionList(): Promise<Array<any>> {
    try {
      const response = await dataManagementApi.get('/courteventglossary');
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
    return [];
  }
}
