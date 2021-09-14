import { Request, Response } from 'express';
import {OtpActions} from "../resources/actions/otpActions";

const email = 'pippo@pluto.com';

export default class OtpLoginController {
  public get(req: Request, res: Response): void {
    const otpAction = new OtpActions();
    const attempts = otpAction.getAttempts(email);
    if (attempts > 1)
    {
      res.render('otp-login', { invalidInputError: false, noValidCodeError: false, attemptCounter: attempts });
    }
    else
    {
      res.redirect('account-locked');
    }
  }

  public post(req: Request, res: Response): void {
    const searchInput = req.body['otp-code'];
    const otpAction = new OtpActions();
    let attempts = otpAction.getAttempts(email);
    if (attempts > 0)
    {
      if (searchInput && searchInput.length === 6 && searchInput.match(/^[0-9]+$/)) {
        const searchInputNumber = parseInt(searchInput);
        const otps = otpAction.validateOtp(searchInputNumber, email);
        if (otps && otps.otpValid) {
          otpAction.resetAttempts(email);
          res.redirect('subscription-management');
        }
        else if(attempts > 1) {
          attempts = otpAction.decrementAttempts(email);
          res.render('otp-login', { invalidInputError: false, noValidCodeError: true, attemptCounter: attempts });
        }
        else {
          res.redirect('account-locked');
        }

      } else {
        attempts = otpAction.decrementAttempts(email);
        if (attempts > 0)
        {
          res.render('otp-login', { invalidInputError: true, noValidCodeError: false, attemptCounter: attempts });
        }
        else
        {
          res.redirect('account-locked');
        }
      }
    }
    else
    {
      res.redirect('account-locked');
    }
  }

}
