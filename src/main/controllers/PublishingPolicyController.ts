import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';

export default class PublishingPolicyController {
    public get(req: PipRequest, res: Response): void {
        res.render('publishing-policy', req.i18n.getDataByLanguage(req.lng)['publishing-policy']);
    }
}
