import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class DeleteCourtSubscriptionSuccessController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const pageToLoad = req.path.slice(1, req.path.length);
        res.render(
            pageToLoad,
            req.i18n.getDataByLanguage(req.lng)[pageToLoad]
        );
    }
}
