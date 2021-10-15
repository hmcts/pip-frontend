import {dataManagementApi} from './utils/axiosConfig';

export class LiveCaseRequests {

  public async getLiveCases(courtId: number): Promise<any> {
    try {
      const response = await dataManagementApi.get(`/lcsu/${courtId}`);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
    return null;
  }
}
