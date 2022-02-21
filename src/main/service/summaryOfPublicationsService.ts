import {PublicationRequests} from '../resources/requests/PublicationRequests';
import {Artefact} from '../models/artefact';

const PublicationReqs = new PublicationRequests();

export class SummaryOfPublicationsService {

  public async getPublications(courtId, verification: boolean): Promise<Artefact[]> {
    return PublicationReqs.getListOfPubs(courtId, verification);
  }

  public async getIndivPubMetadata(artefactId, verification: boolean): Promise<any> {
    return PublicationReqs.getIndividualPubMetadata(artefactId, verification);
  }

  public async getIndivPubFile(artefactId, verification: boolean): Promise<Blob> {
    return PublicationReqs.getIndividualPubFile(artefactId, verification);
  }

  public async getIndivPubJson(artefactId, verification: boolean): Promise<string> {
    return PublicationReqs.getIndividualPubJson(artefactId, verification);
  }
}
