import {Court} from '../../models/court';
import {dataManagementApi} from './utils/axiosConfig';

export class CourtRequests {

  public async getCourt(courtId: number): Promise<Court> {
    try {
      const response = await dataManagementApi.get(`/courts/${courtId}`);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
    return null;
  }

  public async getCourtByName(courtName: string): Promise<Court> {
    try {
      const response = await dataManagementApi.get(`/courts/find/${courtName}`);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
    return null;
  }

  public async getFilteredCourts(filters: string[], values: string[]): Promise<Array<Court>> {
    try {
      const response = await dataManagementApi.get('/courts/filter', {
        data: {
          filters: filters,
          values: values,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
    return null;
  }

  public async getAllCourts(): Promise<Array<Court>> {
    try {
      const response = await dataManagementApi.get('/courts');
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
