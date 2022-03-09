import { dataManagementApi } from './utils/axiosConfig';
import {Artefact} from '../../models/Artefact';

export class PublicationRequests {

  public async getIndividualPublicationMetadata(artefactId, verification): Promise<string> {
    try{
      const response = await dataManagementApi.get(`/publication/${artefactId}`, {headers: {'verification': `${verification}`}});
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

  public async getIndividualPublicationJson(artefactId, verification): Promise<JSON> {
    try {
      const response = await dataManagementApi.get('/publication/' + artefactId + '/payload', {headers: {'verification': `${verification}`}});
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

  public async getIndividualPublicationFile(artefactId, verification): Promise<Blob> {
    try{
      const response = await dataManagementApi.get(`/publication/${artefactId}/file`, {headers: {'verification': `${verification}`}, responseType: 'arraybuffer'});
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

  public async getPublicationsByCourt(courtId: string, verified: boolean, admin: boolean): Promise<Artefact[]> {
    try {
      const response = await dataManagementApi.get(`/publication/courtId/${courtId}`,
        {headers: {verification: verified, 'x-admin': admin}});
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

  public async deletePublication(artefactId: string, email: string): Promise<boolean> {
    try {
      await dataManagementApi.delete(`/publication/${artefactId}`, {headers: {'x-issuer-email': email}});
      return true;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(`Request failed. ${error.request}`);
      } else {
        console.log(`ERROR: ${error.message}`);
      }
    }
    return false;
  }
}
