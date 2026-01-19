import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';

export default class ManageThirdPartySubscriptionsCreatedSuccessController {
    public get(req: PipRequest, res: Response): void {
        res.render(
            'system-admin/manage-third-party-subscriptions-created-success',
            req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriptions-created-success']
        );
        res.clearCookie('listTypeSensitivityCookie');
    }
}
