import { dataManagementApi } from './utils/axiosConfig';
import {Artefact} from '../../models/Artefact';

export class PublicationRequests {

  public async getIndividualPublicationMetadata(artefactId, userId, admin): Promise<string> {
    try{
      const response = await dataManagementApi.get(`/publication/${artefactId}`, {headers: {'x-user-id' :userId, 'x-admin': admin}});
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

  public async getPublicationByCaseValue(searchQuery: string, searchValue: string, userId: string): Promise<Artefact[]> {
    try {
      const response = await dataManagementApi.get(`/publication/search/${searchQuery}/${searchValue}`,
        {headers: {'x-user-id': userId}});
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

  public async getIndividualPublicationJson(artefactId, userId): Promise<JSON> {
    try {
      const response = await dataManagementApi.get('/publication/' + artefactId + '/payload',
        {headers: {'x-user-id': `${userId}`}});
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

  public async getIndividualPublicationFile(artefactId, userId): Promise<Blob> {
    try{
      const response = await dataManagementApi.get(`/publication/${artefactId}/file`,
        {headers: {'x-user-id': `${userId}`}, responseType: 'arraybuffer'});
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

  public async getPublicationsByCourt(courtId: string, userId: string, admin: boolean): Promise<Artefact[]> {
    try {
      const response = await dataManagementApi.get(`/publication/courtId/${courtId}`,
        {headers: {'x-user-id': userId, 'x-admin': admin}});
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
