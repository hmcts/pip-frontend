import { SingleJusticeProcedureCase } from '../models/singleJusticeProcedureCase';
import { SjpRequests } from '../resources/requests/sjpRequests';

const SJPRequests = new SjpRequests();

export class BlobViewService {
  public async getBlobs(): Promise<SingleJusticeProcedureCase[]> {
    return SJPRequests.getSJPCases();
  }
}
