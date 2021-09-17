import { Request, Response } from 'express';
import { CourtActions } from '../resources/actions/courtActions';
import { CourtService } from '../service/courtService';

export default class LiveCaseStatusUpdatesController {

  public get(req: Request, res: Response): void {
    const courtsList = new CourtActions().getCourtsList();
    const alphabeticalCrownCourts = new CourtService().generateCrownCourtArray(courtsList);

    res.render('live-case', {
      courtList: alphabeticalCrownCourts,
    });
  }
}
