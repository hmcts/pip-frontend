import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

const unsubscribeConfirmedUrl = 'bulk-unsubscribe-confirmed';

export default class BulkUnsubscribeConfirmedController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render(unsubscribeConfirmedUrl, req.i18n.getDataByLanguage(req.lng)[unsubscribeConfirmedUrl]);
    }
}
