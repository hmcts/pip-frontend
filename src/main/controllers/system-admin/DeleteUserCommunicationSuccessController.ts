import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

/**
 * Controller for Delete user communication success page
 */
export default class DeleteUserCommunicationSuccessController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render('system-admin/delete-user-communication-success', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-user-communication-success']),
        });
    }
}
