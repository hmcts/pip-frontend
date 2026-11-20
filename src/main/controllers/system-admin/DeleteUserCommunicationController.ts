import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

/**
 * Controller for Delete user communication page
 */
export default class DeleteUserCommunicationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render('system-admin/delete-user-communication', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-user-communication']),
        });
    }
}
