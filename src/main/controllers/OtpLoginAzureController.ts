import { Request, Response } from 'express';

export default class OtpLoginAzureController {
  public get(req: Request, res: Response): void {
    res.render('otp-login-azure');
  }
}
