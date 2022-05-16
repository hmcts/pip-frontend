import { Court } from '../../models/court';
import { dataManagementApi } from './utils/axiosConfig';

const { redisClient } = require('../../cacheManager');

export class CourtRequests {
  public async getCourt(courtId: number): Promise<Court> {
    try {
      const response = await dataManagementApi.get(`/locations/${courtId}`);
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

  public async getCourtByName(courtName: string): Promise<Court> {
    try {
      const response = await dataManagementApi.get(`/locations/name/${courtName}`);
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

  public async getFilteredCourts(regions: string, jurisdictions: string): Promise<Array<Court>> {
    try {
      const response = await dataManagementApi.get('/locations/filter', {
        params: {
          regions: regions,
          jurisdictions: jurisdictions,
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
    let allCachedCourts;
    if (redisClient.status === 'ready') {
      allCachedCourts = await redisClient.get('allCourts');
    }

    if (allCachedCourts) {
      return JSON.parse(allCachedCourts);
    } else {
      try {
        const response = await dataManagementApi.get('/locations');
        if (redisClient.status === 'ready') {
          redisClient.set('allCourts', JSON.stringify(response.data));
        }
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
