import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import { CreateAccountService } from './CreateAccountService';
import { MediaAccount } from '../models/MediaAccount';
import { DateTime } from 'luxon';
import { LogHelper } from '../resources/logging/logHelper';
import { MediaAccountApplication } from '../models/MediaAccountApplication';

const accountManagementRequests = new AccountManagementRequests();
const createAccountService = new CreateAccountService();
const logHelper = new LogHelper();

export class MediaAccountApplicationService {
    public async getDateOrderedMediaApplications(adminUserId: string): Promise<MediaAccountApplication[]> {
        const applications = await accountManagementRequests.getPendingMediaApplications(adminUserId);
        applications?.sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());
        applications?.forEach(application => {
            application.requestDate = DateTime.fromISO(application.requestDate).toFormat('dd MMM yyyy');
        });
        return applications;
    }

    public async getApplicationById(applicationId, adminUserId): Promise<MediaAccount | null> {
        if (applicationId) {
            const mediaAccount = await accountManagementRequests.getMediaApplicationById(applicationId, adminUserId);
            if (mediaAccount) {
                mediaAccount.requestDate = DateTime.fromISO(mediaAccount.requestDate).toFormat('dd MMM yyyy');
                return mediaAccount;
            }
        }

        return null;
    }

    public async getApplicationByIdAndStatus(applicationId, status, adminUserId): Promise<MediaAccount | null> {
        const mediaAccount = await this.getApplicationById(applicationId, adminUserId);

        if (mediaAccount && mediaAccount.status === status) {
            return mediaAccount;
        }

        return null;
    }

    public async getImageById(imageId, adminUserId): Promise<Blob> {
        if (imageId) {
            return accountManagementRequests.getMediaApplicationImageById(imageId, adminUserId);
        }

        return null;
    }

    public async createAccountFromApplication(applicationId, adminId): Promise<MediaAccount> {
        const mediaApplication = await this.getApplicationByIdAndStatus(applicationId, 'PENDING', adminId);

        if (mediaApplication) {
            const mediaAccount = {};
            mediaAccount['emailAddress'] = mediaApplication.email;
            mediaAccount['fullName'] = mediaApplication.fullName;

            logHelper.writeLog(adminId, 'APPROVED_MEDIA_ACCOUNT', mediaApplication.id);

            await createAccountService.createMediaAccount(mediaAccount, adminId);

            return accountManagementRequests.updateMediaApplicationStatus(applicationId, 'APPROVED', adminId);
        }

        return null;
    }

    public async rejectApplication(applicationId, adminId, reasons): Promise<object | null> {
        logHelper.writeLog(adminId, 'REJECT_MEDIA_ACCOUNT', applicationId);
        const updateStatus = await accountManagementRequests.updateMediaApplicationStatus(
            applicationId,
            'REJECTED',
            adminId,
            reasons
        );
        if (updateStatus) {
            return updateStatus;
        } else {
            return null;
        }
    }
}
