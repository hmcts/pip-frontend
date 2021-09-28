import {SearchDescriptionActions} from '../resources/actions/searchDescriptionActions';
import {InputFilterService} from '../service/inputFilterService';
import {CourtService} from '../service/courtService';

export class StatusDescriptionService {

  public generateStatusDescriptionObject(): object {
    let statusDescriptionList = new SearchDescriptionActions().getStatusDescriptionList();
    const alphabetOptions = CourtService.generateAlphabetObject();
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
