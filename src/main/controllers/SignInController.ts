import { Request, Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import authenticationConfig from '../authentication/authentication-config.json';

import { cloneDeep } from 'lodash';

export default class SignInController {
    public get(req: PipRequest, res: Response): void {
        req.query?.error === 'true'
            ? res.render('sign-in', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['sign-in']),
                  displayError: true,
              })
            : res.render('sign-in', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['sign-in']),
                  displayError: false,
              });
    }

    public post(req: Request, res: Response): void {
        switch (req.body?.['sign-in']) {
            case 'hmcts': {
                res.redirect('/cft-login');
                break;
            }
            case 'common': {
                res.redirect('/crime-login');
                break;
            }
            case 'pi': {
                res.redirect(`/login?p=${authenticationConfig.POLICY}`);
                break;
            }
            default: {
                res.redirect('/sign-in?error=true');
            }
        }
    }
}
