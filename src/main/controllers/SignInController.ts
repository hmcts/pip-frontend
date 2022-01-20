import { Request, Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { getRedirectURL } from '../authentication/authRedirect';

const pAndIRedirectUrl = getRedirectURL(process.env.ENV);

export default class SignInController {
  public get(req: PipRequest, res: Response): void {
    (req.query?.error === 'true') ?
      res.render('sign-in', {...cloneDeep(req.i18n.getDataByLanguage(req.lng)['sign-in']), displayError: true}) :
      res.render('sign-in', {...cloneDeep(req.i18n.getDataByLanguage(req.lng)['sign-in']), displayError: false});
  }

  public post(req: Request, res: Response): void {
    switch(req.body['sign-in']) {
      case 'hmcts': {
        res.redirect('https://hmcts-sjp.herokuapp.com/sign-in-idam.html');
        break;
      }
      case 'common': {
        res.redirect('https://hmcts-sjp.herokuapp.com/sign-in-idam.html');
        break;
      }
      case 'pi': {
        res.redirect(pAndIRedirectUrl);
        break;
      }
      default: {
        res.redirect('/sign-in?error=true');
      }
    }
  }
}
