import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';

export default class CookiePolicyPageController {
    public get(req: PipRequest, res: Response): void {
        res.render('cookie-policy', req.i18n.getDataByLanguage(req.lng)['cookie-policy']);
    }
}
