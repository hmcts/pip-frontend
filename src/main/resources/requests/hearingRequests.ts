import { Hearing } from '../../models/hearing';
import { dataManagementApi } from './utils/axiosConfig';
import fs from 'fs';
import path from 'path';

export class HearingRequests {
  mocksPath = '../mocks/';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'caseHearings.json'), 'utf-8');

  public async getHearingsByCaseName(searchQuery: string): Promise<Hearing[]> {
    try {
      const response = await dataManagementApi.get(`/hearings/case-name/${searchQuery}`);
      return response.data;
    }
    catch (error) {
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

  public async getCaseByCaseNumber(caseNumber: string): Promise<Hearing> {
    try {
      const response = await dataManagementApi.get(`/hearings/case-number/${caseNumber}`);
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

