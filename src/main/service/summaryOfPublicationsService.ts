import {PublicationRequests} from '../resources/requests/publicationRequests';
import {Artefact} from '../models/Artefact';

const publicationRequests = new PublicationRequests();

export class SummaryOfPublicationsService {
  public async getPublications(courtId, userId: string, admin = false): Promise<Artefact[]> {
    return publicationRequests.getPublicationsByCourt(courtId, userId, admin);
  }
}
