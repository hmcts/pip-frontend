import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {MediaAccountApplication} from '../models/MediaAccountApplication';

const accountManagementRequests = new AccountManagementRequests();
export class MediaApplicationService {

  private async getPendingMediaApplications(): Promise<MediaAccountApplication[]> {
    return await accountManagementRequests.getPendingMediaApplications();
  }

  async getDateOrderedMediaApplications(): Promise<MediaAccountApplication[]> {
    const applications = await this.getPendingMediaApplications();
    applications?.sort((a, b) =>
      new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime(),
    );
    applications?.forEach(application => {
      application.requestDate = new Date(application.requestDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});
    });
    return applications;
  }
}
