import { SingleJusticeProcedureCase } from '../models/singleJusticeProcedureCase';
import {PublicationRequests} from '../resources/requests/publicationRequests';

const PublicationReqs = new PublicationRequests();

export class PublicationService {

  public async getPublications(courtId): Promise<SingleJusticeProcedureCase[]> {
    return PublicationReqs.getListOfPubs(courtId);
  }
}
