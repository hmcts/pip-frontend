import { Request, Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class SignInController {
  public get(req: PipRequest, res: Response): void {
    res.render('sign-in', req.i18n.getDataByLanguage(req.lng)['sign-in']);
  }

  public post(req: Request, res: Response): void {
    if (req.body['sign-in'] === 'hmcts') {
      res.redirect('https://www.google.com');
    }
    else if (req.body['sign-in'] === 'common') {
      res.redirect('https://www.google.com');
    }
    else if (req.body['sign-in'] === 'pi') {
      res.redirect('https://www.google.com');
    }
    else if (req.body['sign-in'] === 'notsure') {
      res.redirect('https://www.google.com');
    }
    else if (req.body['sign-in'] === 'create') {
      res.redirect('https://www.google.com');
    }
    else {
      res.redirect('sign-in');
    }
  }
}
