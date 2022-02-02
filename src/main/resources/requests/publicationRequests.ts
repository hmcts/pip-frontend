import fs from 'fs';
import path from 'path';
import { SingleJusticeProcedureCase } from '../../models/singleJusticeProcedureCase';
import {dataManagementApi} from './utils/axiosConfig';

export class PublicationRequests {
  mocksPath = '../mocks';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'SingleJusticeProcedureCases.json'), 'utf-8');

  public async getListOfPubs(courtId): Promise<SingleJusticeProcedureCase[]> {
    try {
      const response = await dataManagementApi.get(`/publication/search/${courtId}`, {headers: {'verification':'true'}});
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
