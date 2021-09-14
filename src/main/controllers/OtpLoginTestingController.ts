import { Request, Response } from 'express';

export default class OtpLoginController {

  public get(req: Request, res: Response): void {
    res.render('otp-login-testing');
  }

}
