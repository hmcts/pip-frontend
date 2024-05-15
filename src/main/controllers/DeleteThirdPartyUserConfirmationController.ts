import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import { UserManagementService } from '../service/UserManagementService';

const accountManagementRequests = new AccountManagementRequests();
const userManagementService = new UserManagementService();

export default class DeleteThirdPartyUserConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userId = req.query.userId as string;
        const thirdPartyUser = await accountManagementRequests.getUserByUserId(userId, req.user['userId']);
        res.render('delete-third-party-user-confirmation', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-third-party-user-confirmation']),
            thirdPartyUser,
            userId,
            noOptionError: false,
            failedRequestError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const userId = req.body.user as string;
        const thirdPartyUser = await accountManagementRequests.getUserByUserId(userId, req.user['userId']);
        if (req.body['delete-user-confirm'] === 'yes') {
            const response = await accountManagementRequests.deleteUser(userId, req.user['userId']);
            if (response) {
                await userManagementService.auditAction(
                    req.user,
                    'DELETE_THIRD_PARTY_USER',
                    `Third party user with id ${userId} has been deleted`
                );

                res.redirect('/delete-third-party-user-success');
            } else {
                res.render('delete-third-party-user-confirmation', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-third-party-user-confirmation']),
                    thirdPartyUser,
                    userId,
                    noOptionError: false,
                    failedRequestError: true,
                });
            }
        } else if (req.body['delete-user-confirm'] === 'no') {
            res.redirect(`/manage-third-party-users/view?userId=${userId}`);
        } else {
            res.render('delete-third-party-user-confirmation', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-third-party-user-confirmation']),
                thirdPartyUser,
                userId,
                noOptionError: true,
                failedRequestError: false,
            });
        }
    }
}
