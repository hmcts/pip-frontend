import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommunicationManagementService } from '../../service/UserCommunicationManagementService';

/**
 * Controller for edit user communication page
 */
const userCommunicationManagementService = new UserCommunicationManagementService();
export default class EditUserCommunicationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userCommunicationId = req.query.id as string;

        if (userCommunicationId) {
            const cookieFormData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
            let formData;

            if (cookieFormData.userCommunicationId === userCommunicationId) {
                formData = cookieFormData;
            } else {
                formData = await userCommunicationManagementService.getFormDataById(userCommunicationId, req.user['userId']);
            }

            res.render('system-admin/edit-user-communication', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['edit-user-communication']),
                formData,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const userCommunicationId = req.query.id as string;
        const formData = req.body;

        if (userCommunicationId) {
            const existingData = await userCommunicationManagementService.getFormDataById(userCommunicationId, req.user['userId']);
            const formCookie = {
                ...existingData,
                ...formData,
                userCommunicationId,
            };
            res.cookie('formCookie', JSON.stringify(formCookie), { secure: true, httpOnly: true });
            res.redirect('/edit-user-communication-summary');
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
