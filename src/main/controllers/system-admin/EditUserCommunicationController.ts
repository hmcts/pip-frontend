import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

/**
 * Controller for edit user communication page
 */
export default class EditUserCommunicationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render('system-admin/edit-user-communication', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['edit-user-communication']),
        });
    }
}
