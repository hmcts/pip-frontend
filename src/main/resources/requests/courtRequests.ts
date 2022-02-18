import { Court } from '../../models/court';
import { dataManagementApi } from './utils/axiosConfig';

const { redisClient } = require('../../cacheManager');

export class CourtRequests {
  public async getCourt(courtId: number): Promise<Court> {
    let cachedCourt;

    if (redisClient.status === 'ready') {
      cachedCourt = await redisClient.get(`court-${courtId}`);
    }

    if (cachedCourt) {
      return JSON.parse(cachedCourt);
    } else {
      try {
        const response = await dataManagementApi.get(`/courts/${courtId}`);
        if (redisClient.status === 'ready') {
          redisClient.set(`court-${courtId}`, JSON.stringify(response.data));
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

  public async getCourtByName(courtName: string): Promise<Court> {
    try {
      const response = await dataManagementApi.get(`/courts/name/${courtName}`);
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
      const response = await dataManagementApi.get('/courts/filter', {
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
        const response = await dataManagementApi.get('/courts');
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
