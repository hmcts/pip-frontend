import {LiveCaseRequests} from '../resources/requests/liveCaseRequests';

const liveCaseStatusRequest = new LiveCaseRequests();

export class LiveCaseService {

  public async getLiveCases(courtId: number): Promise<any> {
    return await liveCaseStatusRequest.getLiveCases(courtId);
  }
}
