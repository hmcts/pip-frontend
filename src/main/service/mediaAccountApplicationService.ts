import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import { CreateAccountService } from './createAccountService';
import { MediaAccount } from '../models/mediaAccount';
import { DateTime } from 'luxon';
import { LogHelper } from '../resources/logging/logHelper';

const accountManagementRequests = new AccountManagementRequests();
const createAccountService = new CreateAccountService();
const logHelper = new LogHelper();

export class MediaAccountApplicationService {
    public async getApplicationById(applicationId): Promise<MediaAccount | null> {
        if (applicationId) {
            const mediaAccount = await accountManagementRequests.getMediaApplicationById(applicationId);
            if (mediaAccount) {
                mediaAccount.requestDate = DateTime.fromISO(mediaAccount.requestDate).toFormat('dd MMM yyyy');
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

    public async createAccountFromApplication(applicationId, adminId): Promise<MediaAccount> {
        const mediaApplication = await this.getApplicationByIdAndStatus(applicationId, 'PENDING');

        if (mediaApplication) {
            const mediaAccount = {};
            mediaAccount['emailAddress'] = mediaApplication.email;
            mediaAccount['fullName'] = mediaApplication.fullName;

            logHelper.writeLog(adminId, 'APPROVED_MEDIA_ACCOUNT', mediaApplication.id);

            await createAccountService.createMediaAccount(mediaAccount, adminId);

            return accountManagementRequests.updateMediaApplicationStatus(applicationId, 'APPROVED');
        }

        return null;
    }

    public async rejectApplication(applicationId, adminId, reasons): Promise<object | null> {
        logHelper.writeLog(adminId, 'REJECT_MEDIA_ACCOUNT', applicationId);
        const updateStatus = await accountManagementRequests.updateMediaApplicationStatus(
            applicationId,
            'REJECTED',
            reasons
        );
        if (updateStatus) {
            return updateStatus;
        } else {
            return null;
        }
    }
}
