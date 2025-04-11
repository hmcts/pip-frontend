import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';

export default class BlobViewSubscriptionResubmitConfirmedController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render(
            'system-admin/blob-view-subscription-resubmit-confirmed',
            req.i18n.getDataByLanguage(req.lng)['blob-view-subscription-resubmit-confirmed']
        );
    }
}
