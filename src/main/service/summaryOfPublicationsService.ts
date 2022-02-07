import {SummaryOfPublicationsRequests} from '../resources/requests/summaryOfPublicationsRequests';
import {Publication} from '../models/publication';

const PublicationReqs = new SummaryOfPublicationsRequests();

export class SummaryOfPublicationsService {

  public async getPublications(courtId, verification: boolean): Promise<Publication[]> {
    return PublicationReqs.getListOfPubs(courtId, verification);
  }
}
