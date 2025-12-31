import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';

export default class DeleteThirdPartySubscriberSuccessController {
    public get(req: PipRequest, res: Response): void {
        res.render(
            'system-admin/delete-third-party-subscriber-success',
            req.i18n.getDataByLanguage(req.lng)['delete-third-party-subscriber-success']
        );
    }
}
