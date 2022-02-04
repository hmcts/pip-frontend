import {PublicationRequests} from '../resources/requests/publicationRequests';
import {Publication} from '../models/publication';

const PublicationReqs = new PublicationRequests();

export class PublicationService {

  public async getPublications(courtId): Promise<Publication[]> {
    return PublicationReqs.getListOfPubs(courtId);
  }
}
