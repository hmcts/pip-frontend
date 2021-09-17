import { Request, Response } from 'express';
import { CourtService } from '../service/courtService';

export default class LiveCaseCourtSearchController {

  public get(req: Request, res: Response): void {
    const alphabeticalCrownCourts = new CourtService().generateCrownCourtArray();

    res.render('live-case-alphabet-search', {
      courtList: alphabeticalCrownCourts,
    });
  }
}
