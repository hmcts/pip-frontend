import {CaseEventGlossaryRequests} from '../resources/requests/caseEventGlossaryRequests';
import {CourtService} from '../service/courtService';

const caseEventGlossaryRequests = new CaseEventGlossaryRequests();

export class CaseEventGlossaryService {

  public async generateCourtEventGlossaryObject(): Promise<object> {
    const courtEventGlossaryList: Array<any>= await caseEventGlossaryRequests.getCourtEventGlossaryList();
    const alphabetOptions = CourtService.generateAlphabetObject();

    //Then loop through each status, and add it to the list
    courtEventGlossaryList.forEach(item => {
      if (item.eventStatus !== '') {
        const status = item.name as string;
        alphabetOptions[status.charAt(0).toUpperCase()][item.id] = {
          id: item.id,
          description: item.description,
          status: status,
          initial: status.charAt(0).toUpperCase(),
        };
      }
    });
    return alphabetOptions;
  }
}
