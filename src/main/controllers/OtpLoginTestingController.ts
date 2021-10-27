import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class OtpLoginController {

  public get(req: PipRequest, res: Response): void {
    res.render('otp-login-testing', req.i18n.getDataByLanguage(req.lng)['otp-login-testing']);
  }

}
