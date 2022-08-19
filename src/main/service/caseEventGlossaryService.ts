import {CaseEventGlossaryRequests} from '../resources/requests/caseEventGlossaryRequests';
import {FilterService} from "./filterService";

const caseEventGlossaryRequests = new CaseEventGlossaryRequests();

export class CaseEventGlossaryService {

  public async generateCaseEventGlossaryObject(): Promise<object> {
    const courtEventGlossaryList: Array<any>= await caseEventGlossaryRequests.getCaseEventGlossaryList();
    const alphabetOptions = FilterService.generateAlphabetObject();

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
