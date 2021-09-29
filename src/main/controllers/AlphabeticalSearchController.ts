import { Request, Response } from 'express';
import { CourtService } from '../service/courtService';
import {PipApi} from '../utils/PipApi';

let _api: PipApi;
export default class AlphabeticalSearchController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }
  public async get(req: Request, res: Response): Promise<void> {
    const alphabetObject = await new CourtService(_api).generateCourtsObject();
    res.render('alphabetical-search', {
      courtList: alphabetObject,
    });
  }
}
