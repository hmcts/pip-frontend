import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();

export class MediaAccountApplicationService {

  public async getApplicationById(applicationId): Promise<object | null> {
    return await accountManagementRequests.getMediaApplicationById(applicationId);
  }

  public async getApplicationImageById(imageId): Promise<Blob> {
    return await accountManagementRequests.getMediaApplicationImageById(imageId);
  }

}
