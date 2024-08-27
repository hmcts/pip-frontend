import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';

export default class BulkCreateMediaAccountsConfirmedController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render(
            'system-admin/bulk-create-media-accounts-confirmed',
            req.i18n.getDataByLanguage(req.lng)['system-admin']['bulk-create-media-accounts-confirmed']
        );
    }
}
