import { Location } from '../../models/location';
import { dataManagementApi } from './utils/axiosConfig';

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

  public async getPubsPerLocation(): Promise<Map<number, number>> {
    try {
      const response = await dataManagementApi.get('/publication/count-by-location');
      const splitresp = response.data.split('\n').slice(1, -1);
      const map = new Map();
      splitresp.forEach(line => {
        const commasep = line.split(',');
        map.set(parseInt(commasep[0]), parseInt(commasep[1]));
      });
      return map;
      // return response.data;
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

  public async getLocationByName(courtName: string, language: string): Promise<Location> {
    try {
      const response = await dataManagementApi.get(`/locations/name/${courtName}/language/${language}`);
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

  public async getFilteredCourts(regions: string, jurisdictions: string, language: string): Promise<Array<Location>> {
    try {
      const response = await dataManagementApi.get('/locations/filter', {
        params: {
          regions: regions,
          jurisdictions: jurisdictions,
          language: language,
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
    try {
      const response = await dataManagementApi.get('/locations');
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
