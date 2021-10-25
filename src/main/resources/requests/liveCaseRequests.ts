import {dataManagementApi} from './utils/axiosConfig';

export class LiveCaseRequests {

  public async getLiveCases(courtId: number): Promise<any> {
    try {
      const response = await dataManagementApi.get(`/lcsu/${courtId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(`Request failed. ${JSON.stringify(error.request)}`);
      } else {
        console.log(`ERROR: ${error.message}`);
      }
    }
    return null;
  }
}
