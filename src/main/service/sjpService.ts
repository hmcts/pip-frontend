import { SingleJusticeProcedureCase } from '../models/singleJusticeProcedureCase';
import { SjpRequests } from '../resources/requests/sjpRequests';
import {PublicationRequests} from '../resources/requests/publicationRequests';

const PublicationReqs = new PublicationRequests();
const SJPRequests = new SjpRequests();

export class SjpService {
  public async getSJPCases(): Promise<SingleJusticeProcedureCase[]> {
    return SJPRequests.getSJPCases();
  }

  public async getSJPPublications(): Promise<SingleJusticeProcedureCase[]> {
    return PublicationReqs.getListOfPubsForSJP();
  }
}
