import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import { MediaAccountApplication } from '../models/MediaAccountApplication';
import { DateTime } from 'luxon';

const accountManagementRequests = new AccountManagementRequests();
export class MediaApplicationService {
    private async getPendingMediaApplications(): Promise<MediaAccountApplication[]> {
        return await accountManagementRequests.getPendingMediaApplications();
    }

    async getDateOrderedMediaApplications(): Promise<MediaAccountApplication[]> {
        const applications = await this.getPendingMediaApplications();
        applications?.sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());
        applications?.forEach(application => {
            application.requestDate = DateTime.fromISO(application.requestDate).toFormat('dd MMM yyyy');
        });
        return applications;
    }
}
