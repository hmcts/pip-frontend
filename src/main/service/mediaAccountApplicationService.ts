import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {MediaAccount} from '../models/mediaAccount';

const accountManagementRequests = new AccountManagementRequests();

export class MediaAccountApplicationService {

  public async getApplicationById(applicationId): Promise<MediaAccount | null> {
    return await accountManagementRequests.getMediaApplicationById(applicationId);
  }

  public async getApplicationImageById(imageId): Promise<Blob> {
    return await accountManagementRequests.getMediaApplicationImageById(imageId);
  }

}
