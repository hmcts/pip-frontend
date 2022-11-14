import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import { MediaAccountApplication } from '../models/MediaAccountApplication';
import moment from 'moment';

const accountManagementRequests = new AccountManagementRequests();
export class MediaApplicationService {
  private async getPendingMediaApplications(): Promise<MediaAccountApplication[]> {
    return await accountManagementRequests.getPendingMediaApplications();
  }

  async getDateOrderedMediaApplications(): Promise<MediaAccountApplication[]> {
    const applications = await this.getPendingMediaApplications();
    applications?.sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());
    applications?.forEach(application => {
      application.requestDate = moment(new Date(application.requestDate)).format('DD MMM YYYY');
    });
    return applications;
  }
}
