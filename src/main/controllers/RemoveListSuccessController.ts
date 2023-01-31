import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class RemoveListSuccessController {
    public get(req: PipRequest, res: Response): void {
        res.render('remove-list-success', req.i18n.getDataByLanguage(req.lng)['remove-list-success']);
    }
}
