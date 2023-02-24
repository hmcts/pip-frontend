import { PublicationRequests } from '../resources/requests/publicationRequests';
import { Artefact } from '../models/Artefact';

const publicationRequests = new PublicationRequests();

export class SummaryOfPublicationsService {
    public async getPublications(locationId, userId: string, admin = false): Promise<Artefact[]> {
        return publicationRequests.getPublicationsByCourt(locationId, userId, admin);
    }

    public async getNoMatchPublications(): Promise<Artefact[]> {
        return publicationRequests.getNoMatchPublications();
    }
}
