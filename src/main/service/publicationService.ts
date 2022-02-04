import {PublicationRequests} from '../resources/requests/publicationRequests';
import {Publication} from '../models/publication';

const PublicationReqs = new PublicationRequests();

export class PublicationService {

  public async getPublications(courtId, verification: boolean): Promise<Publication[]> {
    return PublicationReqs.getListOfPubs(courtId, verification);
  }
}
