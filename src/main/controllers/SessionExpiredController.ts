import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { reSignInUrls } from '../models/consts';

export default class SessionExpiredController {
    public get(req: PipRequest, res: Response): void {
        const signInUrl = req.query.reSignInUrl;
        if (signInUrl && typeof signInUrl === 'string' && reSignInUrls[signInUrl as string]) {
            res.render('session-expired', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['session-expired']),
                signInUrl: reSignInUrls[signInUrl],
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
