import {Application} from 'express';
import {CourtActions} from '../resources/actions/CourtActions';
import {InputFilterService} from '../service/inputFilterService';

export default class AlphabeticalSearchController {

  /**
   * Generates the court array, that can then be processed by the template
   * The court array is of the format
   * {
   *   "A": {
   *     "CourtName": {
   *       "id": 1,
   *       "hearings": 4
   *     }
   *   }
   * }
   * The produced list is ordered in alphabetical order
   * @param courtsList The original court array
   * @private
   */
  private generateCourtArray(courtsList): object {
    const alphabetArray = {};
    //Firstly creates the array for the possible alphabet options
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);
      alphabetArray[letter] = {};
    }

    courtsList = new InputFilterService().alphabetiseResults(courtsList, 'name');

    //Then loop through each court, and add it to the list
    courtsList.forEach(item => {
      if (item.hearings != 0) {
        const courtName = item.name as string;
        alphabetArray[courtName.charAt(0).toUpperCase()][courtName] = {
          id: item.courtId,
          hearings: item.hearings,
        };
      }
    });
    return alphabetArray;
  }

  public get(req: Request, res: Application): void{
    const courtsList = new CourtActions().getCourtsList();
    const alphabetArray = new AlphabeticalSearchController().generateCourtArray(courtsList);

    res.render('alphabetical-search', {
      courtList: alphabetArray,
    });
  }

}
