import { Location } from '../../models/location';
import { dataManagementApi } from './utils/axiosConfig';

const { redisClient } = require('../../cacheManager');

export class LocationRequests {
  public async getLocation(locationId: number): Promise<Location> {
    try {
      const response = await dataManagementApi.get(`/locations/${locationId}`);
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

  public async getLocationByName(courtName: string): Promise<Location> {
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

  public async getFilteredCourts(regions: string, jurisdictions: string): Promise<Array<Location>> {
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

  public async getAllLocations(): Promise<Array<Location>> {
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
