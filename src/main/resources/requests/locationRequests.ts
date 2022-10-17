import {Location} from '../../models/location';
import {dataManagementApi} from './utils/axiosConfig';
import axios from 'axios';

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

  public async getFaCTLink(courtName: string): Promise<string> {
    // try {
    const sepCourtName = courtName.toLowerCase().split(' ').join('-');
    const requestLink = 'https://www.find-court-tribunal.service.gov.uk/courts/' + sepCourtName;
    try {
      await axios.get(requestLink);
      console.log('successfully found fact link for courtName');
      return requestLink;
    } catch (error) {
      console.log(error);
      return 'https://www.find-court-tribunal.service.gov.uk/courts?search=' + encodeURI(courtName);
    }
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
