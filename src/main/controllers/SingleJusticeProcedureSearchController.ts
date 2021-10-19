import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class SingleJusticeProcedureSearchController {
  public get(req: PipRequest, res: Response): void {
    res.render('single-justice-procedure-search', req.i18n.getDataByLanguage(req.lng)['single-justice-procedure-search']);
  }
}
