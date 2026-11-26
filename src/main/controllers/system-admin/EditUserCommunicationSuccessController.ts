import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

/**
 * Controller for edit user communication success page
 */
export default class EditUserCommunicationSuccessController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render('system-admin/edit-user-communication-success', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['edit-user-communication-success']),
        });
    }
}
