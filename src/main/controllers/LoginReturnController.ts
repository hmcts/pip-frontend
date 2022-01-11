import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class LoginReturnController {

  public get(req: PipRequest, res: Response): void {
    res.render('login-return', req.i18n.getDataByLanguage(req.lng)['login-return']);
  }
}
