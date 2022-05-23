import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {MediaAccount} from '../models/mediaAccount';
import moment from 'moment';

const accountManagementRequests = new AccountManagementRequests();

export class MediaAccountApplicationService {

  public async getApplicationById(applicationId): Promise<MediaAccount | null> {
    if (applicationId) {
      const mediaAccount = await accountManagementRequests.getMediaApplicationById(applicationId);
      if (mediaAccount) {
        mediaAccount.requestDate = moment(Date.parse(mediaAccount.requestDate)).format('DD MMMM YYYY');
        return mediaAccount;
      }
    }

    return null;
  }

  public async getApplicationByIdAndStatus(applicationId, status): Promise<MediaAccount | null> {
    const mediaAccount = await this.getApplicationById(applicationId);

    if (mediaAccount && mediaAccount.status === status) {
      return mediaAccount;
    }

    return null;
  }

  public async getApplicationImageById(imageId): Promise<Blob> {
    if (imageId) {
      return accountManagementRequests.getMediaApplicationImageById(imageId);
    }

    return null;
  }

}
