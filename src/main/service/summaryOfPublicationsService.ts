import {PublicationRequests} from '../resources/requests/publicationRequests';
import {Artefact} from '../models/Artefact';

const publicationRequests = new PublicationRequests();

export class SummaryOfPublicationsService {
  public async getPublications(locationId, verification: boolean, admin = false): Promise<Artefact[]> {
    return publicationRequests.getPublicationsByCourt(locationId, verification, admin);
  }
}
