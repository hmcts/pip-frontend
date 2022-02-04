import {dataManagementApi} from './utils/axiosConfig';
import {Publication} from '../../models/publication';

export class PublicationRequests {

  public async getListOfPubs(courtId, verification): Promise<Publication[]> {
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
  }
}
