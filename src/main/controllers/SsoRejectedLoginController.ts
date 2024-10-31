import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import {ssoNotAuthorised} from "../helpers/consts";

/**
 * Controller for handling SSO Rejected logins
 */
export default class SsoRejectedLoginController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const sessionMessages = req['session']?.messages;
        if (Array.isArray(sessionMessages) && sessionMessages.length > 0 && sessionMessages[0] === ssoNotAuthorised) {
            res.render('sso-rejected-login', req.i18n.getDataByLanguage(req.lng)['sso-rejected-login']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }

    }
}
