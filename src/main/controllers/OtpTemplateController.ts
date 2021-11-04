import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class OtpTemplateController {

  public get(req: PipRequest, res: Response): void {
    res.render('otp-template', req.i18n.getDataByLanguage(req.lng)['otp-template']);
  }
}
