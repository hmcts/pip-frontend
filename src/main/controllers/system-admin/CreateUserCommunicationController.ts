import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommunicationManagementService } from '../../service/UserCommunicationManagementService';

/**
 * Controller for create user communication page
 */
const userCommunicationManagementService = new UserCommunicationManagementService();
export default class CreateUserCommunicationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        res.render('system-admin/create-user-communication', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-user-communication']),
            formData,
        });
    }

    public post(req: PipRequest, res: Response): void {
        const formData = req.body;
        const formErrors = userCommunicationManagementService.validateUserCommunicationFormFields(formData);

        if (formErrors) {
            res.render('system-admin/create-user-communication', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-user-communication']),
                formData,
                formErrors,
            });
        } else {
            res.cookie('formCookie', JSON.stringify(formData), { secure: true });
            res.redirect('/create-user-communication-summary');
        }
    }
}
