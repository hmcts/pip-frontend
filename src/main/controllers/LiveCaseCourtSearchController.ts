import { Request, Response } from 'express';
import { CourtService } from '../service/courtService';
import {PipApi} from '../utils/PipApi';

let _api: PipApi;
export default class LiveCaseCourtSearchController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  public async get(req: Request, res: Response): Promise<void> {
    const alphabeticalCrownCourts = await new CourtService(_api).generateCrownCourtArray();

    res.render('live-case-alphabet-search', {
      courtList: alphabeticalCrownCourts,
    });
  }
}
