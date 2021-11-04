import {StatusDescriptionRequests} from '../resources/requests/statusDescriptionRequests';
import {CourtService} from '../service/courtService';

const statusDescriptionRequests = new StatusDescriptionRequests();

export class StatusDescriptionService {

  public async generateStatusDescriptionObject(): Promise<object> {
    const statusDescriptionList: Array<any>= await statusDescriptionRequests.getStatusDescriptionList();
    const alphabetOptions = CourtService.generateAlphabetObject();

    //Then loop through each status, and add it to the list
    statusDescriptionList.forEach(item => {
      if (item.eventStatus !== '') {
        const status = item.eventName as string;
        alphabetOptions[status.charAt(0).toUpperCase()][item.eventId] = {
          id: item.eventId,
          description: item.eventStatus,
          status: status,
          initial: status.charAt(0).toUpperCase(),
        };
      }
    });
    return alphabetOptions;
  }
}
