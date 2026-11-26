import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommunicationManagementService } from '../../service/UserCommunicationManagementService';
import { UserManagementService } from '../../service/UserManagementService';

/**
 * Controller for Delete user communication page
 */
const userCommunicationManagementService = new UserCommunicationManagementService();
const userManagementService = new UserManagementService();

export default class DeleteUserCommunicationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userCommunicationId = req.query.id as string;

        if (userCommunicationId) {
            const formData = await userCommunicationManagementService.getFormDataById(
                userCommunicationId,
                req.user['userId']
            );
            if (Object.keys(formData).length > 0) {
                res.render('system-admin/delete-user-communication', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-user-communication']),
                    header: userCommunicationManagementService.getTableHeaders(),
                    userCommunicationData: userCommunicationManagementService.fetchUserCommunicationSummary(
                        formData,
                        req.lng
                    ),
                    userCommunicationId,
                    displayError: false,
                });
                return;
            }
        }
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.body;
        const userCommunicationId = formData.userCommunicationId;

        if (!userCommunicationId) {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
            return;
        }

        const userCommunication = await userCommunicationManagementService.getFormDataById(
            userCommunicationId,
            req.user['userId']
        );

        switch (formData['delete-choice']) {
            case 'yes': {
                const response = await userCommunicationManagementService.deleteUserCommunication(
                    userCommunicationId,
                    req.user['userId']
                );
                if (response) {
                    await userManagementService.auditAction(
                        req.user,
                        'USER_COMMUNICATION_DELETE',
                        `User communication deleted for: ${userCommunication.typeOfCommunication}`
                    );
                    res.redirect('/delete-user-communication-success');
                } else {
                    res.render('system-admin/delete-user-communication', {
                        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-user-communication']),
                        header: userCommunicationManagementService.getTableHeaders(),
                        userCommunicationData: userCommunicationManagementService.fetchUserCommunicationSummary(
                            userCommunication,
                            req.lng
                        ),
                        userCommunicationId,
                        displayError: true,
                    });
                }
                break;
            }
            case 'no': {
                res.redirect('/user-communication-management');
                break;
            }
            default:
                res.render('system-admin/delete-user-communication', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-user-communication']),
                    header: userCommunicationManagementService.getTableHeaders(),
                    userCommunicationData: userCommunicationManagementService.fetchUserCommunicationSummary(
                        userCommunication,
                        req.lng
                    ),
                    userCommunicationId,
                    displayError: true,
                });
        }
    }
}
