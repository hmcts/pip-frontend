import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';

export default class ManageThirdPartySubscriptionsUpdatedSuccessController {
    public get(req: PipRequest, res: Response): void {
        res.render(
            'system-admin/manage-third-party-subscriptions-updated-success',
            req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriptions-updated-success']
        );
        res.clearCookie('formCookie');
    }
}
