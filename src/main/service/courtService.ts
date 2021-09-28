import { InputFilterService } from './inputFilterService';
import { CourtActions } from '../resources/actions/courtActions';
import {PipApi} from '../utils/PipApi';
import {Court} from '../models/court';

let _api: PipApi;
export class CourtService {


  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  private static generateAlphabetObject(): object {
    // create the object for the possible alphabet options
    const alphabetOptions = {};

    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);
      alphabetOptions[letter] = {};
    }

    return alphabetOptions;
  }

  public async generateCourtsObject(): Promise<object> {
    let courtsList = await new CourtActions(_api).getCourtsList();
    const alphabetOptions = CourtService.generateAlphabetObject();
    courtsList = new InputFilterService().alphabetiseResults(courtsList, 'name');

    //Then loop through each court, and add it to the list
    courtsList.forEach(item => {
      if (item.hearings !== 0) {
        const courtName = item.name as string;
        alphabetOptions[courtName.charAt(0).toUpperCase()][courtName] = {
          id: item.courtId,
          hearings: item.hearings,
        };
      }
    });
    return alphabetOptions;
  }

  public async generateCrownCourtArray(): Promise<object> {
    let courtsList: Array<Court> = await new CourtActions(_api).getCourtsList();
    const alphabetOptions = CourtService.generateAlphabetObject();
    courtsList = new InputFilterService().alphabetiseResults(courtsList, 'name');

    // Then loop through each court, and add it to the list
    courtsList.forEach(item => {
      // TODO: Back end should have an API which returns only crown courts
      if (item.jurisdiction === 'Crown Court') {
        const courtName = item.name as string;
        alphabetOptions[courtName.charAt(0).toUpperCase()][courtName] = {
          id: item.courtId,
        };
      }
    });
    return alphabetOptions;
  }
}
