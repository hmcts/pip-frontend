import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class DeleteCourtReferenceDataSuccessController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render(
            'delete-court-reference-data-success',
            req.i18n.getDataByLanguage(req.lng)['delete-court-reference-data-success']
        );
    }
}
