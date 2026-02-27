import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class ManageThirdPartySubscriberStatusSuccessController {
    public get(req: PipRequest, res: Response): void {
        res.render('system-admin/manage-third-party-subscriber-status-success', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriber-status-success']),
        });
    }
}
