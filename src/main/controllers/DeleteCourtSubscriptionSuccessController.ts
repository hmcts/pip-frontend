import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class DeleteCourtSubscriptionSuccessController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render(
            'delete-court-subscription-success',
            req.i18n.getDataByLanguage(req.lng)['delete-court-subscription-success']
        );
    }
}
