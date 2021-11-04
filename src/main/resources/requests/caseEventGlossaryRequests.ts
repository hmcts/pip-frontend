import {dataManagementApi} from './utils/axiosConfig';

export class CaseEventGlossaryRequests {

  public async getCourtEventGlossaryList(): Promise<Array<any>> {
    try {
      const response = await dataManagementApi.get('/glossary');
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
