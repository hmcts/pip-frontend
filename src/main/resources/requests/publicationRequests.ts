import {dataManagementApi} from './utils/axiosConfig';
import {Artefact} from '../../models/Artefact';

export class PublicationRequests {

  public async getPublicationByCaseValue(searchQuery: string, searchValue: string, verified: boolean): Promise<Artefact[]> {
    try {
      const response = await dataManagementApi.get(`/publication/search/${searchQuery}/${searchValue}`,
        {headers: {verification: verified}});
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
    return [];
  }

  public async getPublicationsByCourt(courtId: string, verified: boolean): Promise<Artefact[]> {
    try {
      const response = await dataManagementApi.get(`/publication/courtId/${courtId}`,
        {headers: {verification: verified}});
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
    return [];
  }
}
