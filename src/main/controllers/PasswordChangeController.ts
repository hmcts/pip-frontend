import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';

export default class PasswordChangeController {
  public get(req: PipRequest, res: Response): void {
    res.render('password-change-confirmation', req.i18n.getDataByLanguage(req.lng)['password-change-confirmation']);
  }
}
