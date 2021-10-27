import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class OtpLoginController {

<<<<<<< HEAD:src/main/controllers/OtpTemplateController.ts
  public get(req: Request, res: Response): void {
    res.render('otp-template');
=======
  public get(req: PipRequest, res: Response): void {
    res.render('otp-login-testing', req.i18n.getDataByLanguage(req.lng)['otp-login-testing']);
>>>>>>> master:src/main/controllers/OtpLoginTestingController.ts
  }

}
