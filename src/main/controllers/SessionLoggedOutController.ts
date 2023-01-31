import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class SessionLoggedOutController {
    public get(req: PipRequest, res: Response): void {
        res.render('session-logged-out', req.i18n.getDataByLanguage(req.lng)['session-logged-out']);
    }
}
