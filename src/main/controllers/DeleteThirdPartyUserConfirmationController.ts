import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();

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
