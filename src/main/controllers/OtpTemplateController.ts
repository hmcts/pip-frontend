import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class OtpTemplateController {

<<<<<<< HEAD
<<<<<<< HEAD:src/main/controllers/OtpTemplateController.ts
  public get(req: Request, res: Response): void {
    res.render('otp-template');
=======
  public get(req: PipRequest, res: Response): void {
    res.render('otp-login-testing', req.i18n.getDataByLanguage(req.lng)['otp-login-testing']);
>>>>>>> master:src/main/controllers/OtpLoginTestingController.ts
=======
  public get(req: PipRequest, res: Response): void {
    res.render('otp-template', req.i18n.getDataByLanguage(req.lng)['otp-template']);
>>>>>>> 9f828b2b1afe6f767327409f9f80baf7c7c3dd63
  }
}
