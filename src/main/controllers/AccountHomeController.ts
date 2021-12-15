import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class AccountHomeController {
  public get(req: PipRequest, res: Response): void {
    res.render('account-home', req.i18n.getDataByLanguage(req.lng)['account-home']);
  }
}
