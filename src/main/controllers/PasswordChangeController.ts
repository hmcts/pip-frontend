import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

export default class PasswordChangeController {
    public post(req: PipRequest, res: Response): void {
        const betaText = JSON.parse(JSON.stringify(req.i18n.getDataByLanguage(req.lng).template)).betaHeadingAdmin;
        res.render('password-change-confirmation', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['password-change-confirmation']),
            betaText: betaText,
            isAdmin: req.params['isAdmin'] === 'true',
        });
    }
}
