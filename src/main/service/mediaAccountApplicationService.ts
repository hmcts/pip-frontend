import {MediaApplicationRequests} from '../resources/requests/mediaApplicationRequests';

const mediaApplicationRequests = new MediaApplicationRequests();

export class MediaAccountApplicationService {

  public async getApplicationById(applicationId): Promise<object | null> {
    return await mediaApplicationRequests.getMediaAccountById(applicationId);
  }
}
