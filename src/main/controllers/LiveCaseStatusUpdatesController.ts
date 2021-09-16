import { Request, Response } from 'express';
import { CourtActions } from '../resources/actions/courtActions';
import { InputFilterService } from '../service/inputFilterService';

export default class LiveCaseStatusUpdatesController {
  private generateCrownCourtArray(courtsList): object {
    const alphabetArray = {};
    // Firstly creates the array for the possible alphabet options
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);
      alphabetArray[letter] = {};
    }

    courtsList = new InputFilterService().alphabetiseResults(courtsList, 'name');

    // Then loop through each court, and add it to the list
    courtsList.forEach(item => {
      // TODO: Back end should have an API which returns only crown courts
      if (item.hearings !== 0 && item.jurisdiction === 'Crown Court') {
        const courtName = item.name as string;
        alphabetArray[courtName.charAt(0).toUpperCase()][courtName] = {
          id: item.courtId,
        };
      }
    });
    return alphabetArray;
  }

  public get(req: Request, res: Response): void {
    const courtsList = new CourtActions().getCourtsList();
    const alphabeticalCrownCourts = new LiveCaseStatusUpdatesController().generateCrownCourtArray(courtsList);

    res.render('live-hearings', {
      courtList: alphabeticalCrownCourts,
    });
  }
}
