import {SearchDescriptionRequests} from '../resources/requests/searchDescriptionRequests';
import {CourtService} from '../service/courtService';

const searchDescriptionRequests = new SearchDescriptionRequests();

export class StatusDescriptionService {

  public async generateStatusDescriptionObject(): Promise<object> {
    const statusDescriptionList: Array<any>= await searchDescriptionRequests.getStatusDescriptionList();
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
