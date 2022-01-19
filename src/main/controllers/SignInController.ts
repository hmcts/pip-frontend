import { Request, Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';

const authConfig = require('../authentication/authentication-config.json');
const pAndIRedirectUrl = `${authConfig.AUTHORISATION_ENDPOINT}?p=${authConfig.PI_FLOW_NAME}&client_id=${authConfig.CLIENT_ID}&nonce=defaultNonce&redirect_uri=${authConfig.REDIRECT_URI}&scope=openid&response_type=id_token&prompt=login`;

export default class SignInController {
  public get(req: PipRequest, res: Response): void {
    res.render('sign-in', req.i18n.getDataByLanguage(req.lng)['sign-in']);
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
        res.redirect('/sign-in');
      }
    }
  }
}
