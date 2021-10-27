import { Request, Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class OtpLoginController {
  public get(req: PipRequest, res: Response): void {
    res.render('otp-login', req.i18n.getDataByLanguage(req.lng)['otp-login']);
  }

  public post(req: Request, res: Response): void {
    if (req.body['otp-code'] && req.body['otp-code'].length === 6 && req.body['otp-code'].match(/^\d+$/)) {
      res.redirect('subscription-management');
    } else {
      res.redirect('otp-login');
    }

  }

}
