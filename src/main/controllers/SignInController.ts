import { Request, Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import LaunchDarklyService from '../service/launchDarkly-service';
const { Logger } = require('@hmcts/nodejs-logging');
const authenticationConfig = require('../authentication/authentication-config.json');
const logger = Logger.getLogger('sign-in-page');

export default class SignInController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const toggleOFS = await LaunchDarklyService.getInstance().getVariation( 'sign-in-out-of-service', false);
    (req.query?.error === 'true') ?
      res.render('sign-in', {...cloneDeep(req.i18n.getDataByLanguage(req.lng)['sign-in']), displayError: true}) :
      (toggleOFS == true) ?
        res.redirect('/view-option') :
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
