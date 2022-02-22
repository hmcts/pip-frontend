import {dataManagementApi} from './utils/axiosConfig';
import {Artefact} from '../../models/Artefact';

export class PublicationRequests {

  public async getListOfPubs(courtId, verification): Promise<Artefact[]> {

    try {
      const response = await dataManagementApi.get(`/publication/search/${courtId}`, {headers: {'verification':`${verification}`}});
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
  public async getIndividualPubMetadata(artefactId, verification): Promise<string> {
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

  public async getIndividualPubJson(artefactId, verification): Promise<string> {
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

  public async getIndividualPubFile(artefactId, verification): Promise<Blob> {
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
}
