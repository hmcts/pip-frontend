import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommunicationManagementService } from '../../service/UserCommunicationManagementService';
import { UserManagementService } from '../../service/UserManagementService';

/**
 * Controller for create user communication summary page
 */
const userCommunicationManagementService = new UserCommunicationManagementService();
const userManagementService = new UserManagementService();
export default class CreateUserCommunicationSummaryController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        res.render('system-admin/create-user-communication-summary', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-user-communication-summary']),
            header: userCommunicationManagementService.getTableHeaders(),
            userCommunicationData: userCommunicationManagementService.fetchUserCommunicationSummary(formData, req.lng),
            displayError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        const response = await userCommunicationManagementService.createUserCommunication(formData, req.user['userId']);

        if (response) {
            await userManagementService.auditAction(
                req.user,
                'USER_COMMUNICATION_CREATION',
                `User communication created for: ${formData.typeOfCommunication}`
            );
            res.redirect('/create-user-communication-success');
        } else {
            res.render('system-admin/create-user-communication-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-user-communication-summary']),
                formData,
                displayError: true,
            });
        }
    }
}
