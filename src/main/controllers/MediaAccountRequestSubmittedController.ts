import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class MediaAccountRequestSubmittedController {
    public get(req: PipRequest, res: Response): void {
        res.render('account-request-submitted', req.i18n.getDataByLanguage(req.lng)['account-request-submitted']);
    }
}
