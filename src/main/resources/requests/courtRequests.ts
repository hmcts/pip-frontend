import { Court } from '../../models/court';
import { dataManagementApi } from './utils/axiosConfig';

const { cacheGet, cacheSet } = require('../../cacheManager');

export class CourtRequests {
  public async getCourt(courtId: number): Promise<Court> {
    const cachedCourt = await cacheGet(`courtId-${courtId}`);

    if (cachedCourt) {
      return JSON.parse(cachedCourt);
    } else {
      try {
        const response = await dataManagementApi.get(`/courts/${courtId}`);
        cacheSet(`courtId-${courtId}`, JSON.stringify(response.data));
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

  public async getCourtByName(courtName: string): Promise<Court> {
    try {
      const response = await dataManagementApi.get(`/courts/find/${courtName}`);
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

  public async getAllCourts(): Promise<Array<Court>> {
    const allCachedCourts = await cacheGet('allCourts');

    if (allCachedCourts) {
      return JSON.parse(allCachedCourts);
    } else {
      try {
        const response = await dataManagementApi.get('/courts');
        cacheSet('allCourts', JSON.stringify(response.data));
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

}
