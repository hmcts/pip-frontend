import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

/**
 * Controller for create user communication page
 */
export default class CreateUserCommunicationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render('system-admin/create-user-communication', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-user-communication']),
        });
    }
}
