import {SearchDescriptionActions} from '../resources/actions/searchDescriptionActions';
import {InputFilterService} from '../service/inputFilterService';

export class StatusDescriptionService {
  private static generateAlphabetObject(): object {
    // create the object for the possible alphabet options
    const alphabetOptions = {};

    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);
      alphabetOptions[letter] = {};
    }

    return alphabetOptions;
  }

  public generateStatusDescriptionObject(): object {
    let statusDescriptionList = new SearchDescriptionActions().getStatusDescriptionList();
    const alphabetOptions = StatusDescriptionService.generateAlphabetObject();
    statusDescriptionList = new InputFilterService().alphabetiseResults(statusDescriptionList, 'name');

    //Then loop through each status, and add it to the list
    statusDescriptionList.forEach(item => {
      if (item.description !== '') {
        const status = item.name as string;
        alphabetOptions[status.charAt(0).toUpperCase()][status] = {
          id: item.statusId,
          description: item.description,
        };
      }
    });
    return alphabetOptions;
  }
}
