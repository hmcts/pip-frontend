import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {MediaAccount} from '../models/mediaAccount';

const accountManagementRequests = new AccountManagementRequests();

export class MediaAccountApplicationService {

  public async getApplicationById(applicationId): Promise<MediaAccount | null> {
    return accountManagementRequests.getMediaApplicationById(applicationId);
  }

  public async getApplicationImageById(imageId): Promise<Blob> {
    return accountManagementRequests.getMediaApplicationImageById(imageId);
  }

}
