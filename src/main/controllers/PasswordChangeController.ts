import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

export default class PasswordChangeController {
    public post(req: PipRequest, res: Response): void {
        res.render('password-change-confirmation', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['password-change-confirmation']),
            isAdmin: req.params['isAdmin'] === 'true',
        });
    }
}
