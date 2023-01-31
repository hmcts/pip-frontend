import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class DeleteSubscriptionController {
    public get(req: PipRequest, res: Response): void {
        const subscription = req.query.subscription;
        res.render('delete-subscription', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-subscription']),
            subscription,
        });
    }
}
