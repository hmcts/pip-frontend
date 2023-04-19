import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

export default class CancelledPasswordResetController {
    public get(req: PipRequest, res: Response): void {
        const betaText = JSON.parse(JSON.stringify(req.i18n.getDataByLanguage(req.lng).template)).betaHeadingAdmin;
        res.render('cancelled-password-reset', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['cancelled-password-reset']),
            betaText: betaText,
            isAdmin: req.params['isAdmin'] === 'true',
        });
    }
}
