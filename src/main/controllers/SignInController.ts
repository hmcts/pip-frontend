import { Request, Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class SignInController {
  public get(req: PipRequest, res: Response): void {
    res.render('sign-in', req.i18n.getDataByLanguage(req.lng)['sign-in']);
  }

  public post(req: Request, res: Response): void {
    switch(req.body['sign-in']) {
      case 'hmcts': {
        res.redirect('https://www.google.com');
        break;
      }
      case 'common': {
        res.redirect('https://www.google.com');
        break;
      }
      case 'pi': {
        res.redirect('https://www.google.com');
        break;
      }
      case 'notsure':
        res.redirect('https://www.google.com');
        break;
      case 'create':
        res.redirect('https://www.google.com');
        break;
      default:
        res.redirect('/sign-in');
    }
  }
}
