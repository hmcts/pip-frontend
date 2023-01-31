import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class SessionExpiringController {
    public get(req: PipRequest, res: Response): void {
        res.render('session-expiring', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['session-expiring']),
            gotoPage: req.query.currentPath,
        });
    }
}
