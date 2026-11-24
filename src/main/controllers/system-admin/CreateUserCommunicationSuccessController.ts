import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

/**
 * Controller for create user communication success page
 */
export default class CreateUserCommunicationSuccessController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render('system-admin/create-user-communication-success', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-user-communication-success']),
        });
    }
}
