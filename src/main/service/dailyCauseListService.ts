import { DailyCauseListRequests } from '../resources/requests/dailyCauseListRequests';

const dailyCauseListRequests = new DailyCauseListRequests();

export class DailyCauseListService {
  public async getDailyCauseList(artefactId: string): Promise<any> {
    return await dailyCauseListRequests.getDailyCauseList(artefactId);
  }
}
