import {dataManagementApi} from './utils/axiosConfig';

export class LiveCaseRequests {

  public async getLiveCases(courtId: number): Promise<any> {
    try {
      const response = await dataManagementApi.get(`/lcsu/${courtId}`);
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
