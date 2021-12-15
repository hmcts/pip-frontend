import { Hearing } from '../models/hearing';
import { HearingRequests } from '../resources/requests/hearingRequests';

const hearingRequests = new HearingRequests();

export class HearingService {
  public async getHearingsByCaseName(searchQuery: string): Promise<Hearing[]> {
    return await hearingRequests.getHearingsByCaseName(searchQuery);
  }

  public async getHearingsById(id: number): Promise<Hearing> {
    return await hearingRequests.getHearingsById(id);
  }

  public async getCaseByNumber(caseNumber): Promise<Hearing> {
    return await hearingRequests.getCaseByCaseNumber(caseNumber);
  }
}
