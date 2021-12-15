import { Hearing } from '../../models/hearing';
import { dataManagementApi } from './utils/axiosConfig';
import fs from 'fs';
import path from 'path';
import {CaseSubscription} from '../../models/caseSubscription';

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

  public async getHearingsById(id: number): Promise<Hearing> {
    const subscriptionsData = JSON.parse(this.rawData) as CaseSubscription[];
    let result = null;
    try {
      //TODO: we need to call the api to retrieve the hearing at the moment mocked
      //const response = await dataManagementApi.get(`/hearings/${id}`);
      //return response.data;
      subscriptionsData.forEach(x=>{
        if (x.hearingId === id)
          result = x;
      });
      return result;
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
    return null;
  }
}

