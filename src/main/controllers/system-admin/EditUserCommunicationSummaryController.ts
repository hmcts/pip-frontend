import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommunicationManagementService } from '../../service/UserCommunicationManagementService';
import { UserManagementService } from '../../service/UserManagementService';

/**
 * Controller for edit user communication summary page
 */
const userCommunicationManagementService = new UserCommunicationManagementService();
const userManagementService = new UserManagementService();
export default class EditUserCommunicationSummaryController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        res.render('system-admin/edit-user-communication-summary', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['edit-user-communication-summary']),
            header: userCommunicationManagementService.getTableHeaders(),
            userCommunicationData: userCommunicationManagementService.fetchUserCommunicationSummary(formData, req.lng),
            displayError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        const userCommunicationId = formData.userCommunicationId;

        if (!userCommunicationId) {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
            return;
        }

        const response = await userCommunicationManagementService.updateUserCommunication(
            formData,
            userCommunicationId,
            req.user['userId']
        );

        if (response) {
            await userManagementService.auditAction(
                req.user,
                'USER_COMMUNICATION_UPDATE',
                `User communication updated for: ${formData.typeOfCommunication}`
            );
            res.redirect('/edit-user-communication-success');
        } else {
            res.render('system-admin/edit-user-communication-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['edit-user-communication-summary']),
                formData,
                displayError: true,
            });
        }
    }
}
