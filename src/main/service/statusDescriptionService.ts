import {SearchDescriptionActions} from '../resources/actions/searchDescriptionActions';
import {InputFilterService} from '../service/inputFilterService';
import {CourtService} from '../service/courtService';
import {PipApi} from '../utils/PipApi';

let _api: PipApi;
export class StatusDescriptionService {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  public async generateStatusDescriptionObject(): Promise<object> {
    let statusDescriptionList = await new SearchDescriptionActions(_api).getStatusDescriptionList();
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
