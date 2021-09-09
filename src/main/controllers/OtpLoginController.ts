import { Request, Response } from 'express';

export default class OtpLoginController {
  public get(req: Request, res: Response): void {
    res.render('otp-login');
  }

  public post(req: Request, res: Response): void {
    if (req.body['otp-code'] && req.body['otp-code'].length === 6) {
      res.redirect('subscription-management');
    } else {
      res.redirect('otp-login');
    }

  }

}
