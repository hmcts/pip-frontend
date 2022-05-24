import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {CreateAccountService} from '../service/createAccountService';
import {MediaAccount} from '../models/mediaAccount';
import moment from 'moment';

const accountManagementRequests = new AccountManagementRequests();
const createAccountService = new CreateAccountService();

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

  public async getImageById(imageId): Promise<Blob> {
    if (imageId) {
      return accountManagementRequests.getMediaApplicationImageById(imageId);
    }

    return null;
  }

  public async createAccountFromApplication(applicationId, adminEmail): Promise<MediaAccount> {

    const mediaApplication = await this.getApplicationByIdAndStatus(applicationId, 'PENDING');

    if (mediaApplication) {
      const mediaAccount = {};
      mediaAccount['emailAddress'] = mediaApplication.email;
      mediaAccount['fullName'] = mediaApplication.fullName;

      await createAccountService.createMediaAccount(mediaAccount, adminEmail);

      return accountManagementRequests.updateMediaApplicationStatus(applicationId, 'APPROVED');
    }

    return null;
  }

}
