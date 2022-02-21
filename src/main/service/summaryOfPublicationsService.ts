import {PublicationRequests} from '../resources/requests/publicationRequests';
import {Artefact} from '../models/Artefact';

const PublicationReqs = new PublicationRequests();

export class SummaryOfPublicationsService {
  public async getPublications(courtId, verification: boolean): Promise<Artefact[]> {
    return PublicationReqs.getPublicationsByCourt(courtId, verification);
  }
}
