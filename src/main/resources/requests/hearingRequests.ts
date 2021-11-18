import { Hearing } from '../../models/hearing';
import { dataManagementApi } from './utils/axiosConfig';

export class HearingRequests {
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

  public async getHearingByCaseReferenceNumber(caseReferenceNo: string): Promise<Array<Hearing>> {
    try {
      const response = await dataManagementApi.get(`/hearings/case-number/${caseReferenceNo}`);
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

