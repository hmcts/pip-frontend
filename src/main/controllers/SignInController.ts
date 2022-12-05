import { Request, Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

const { Logger } = require('@hmcts/nodejs-logging');
const authenticationConfig = require('../authentication/authentication-config.json');
const logger = Logger.getLogger('sign-in-page');

export default class SignInController {
  public get(req: PipRequest, res: Response): void {
    (req.query?.error === 'true') ?
      res.render('sign-in', {enableCft: process.env.ENABLE_CFT, ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['sign-in']), displayError: true}) :
      res.render('sign-in', {enableCft: process.env.ENABLE_CFT, ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['sign-in']), displayError: false});
  }

  public post(req: Request, res: Response): void {
    switch(req.body['sign-in']) {
      case 'hmcts': {
        res.redirect('/cft-login');
        break;
      }
      case 'common': {
        res.redirect('https://hmcts-sjp.herokuapp.com/sign-in-idam.html');
        break;
      }
      case 'pi': {
        logger.info('redirect policy', authenticationConfig.POLICY);
        res.redirect(`/login?p=${authenticationConfig.POLICY}`);
        break;
      }
      default: {
        res.redirect('/sign-in?error=true');
      }
    }
  }
}
