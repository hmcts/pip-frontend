import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class UnprocessedRequestController {
    public get(req: PipRequest, res: Response): void {
        res.render('unprocessed-request', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['unprocessed-request']),
        });
    }
}
