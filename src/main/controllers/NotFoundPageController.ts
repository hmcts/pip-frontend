import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';

export default class NotFoundPageController {
    public get(req: PipRequest, res: Response): void {
        res.render('not-found', req.i18n.getDataByLanguage(req.lng)['not-found']);
    }
}
