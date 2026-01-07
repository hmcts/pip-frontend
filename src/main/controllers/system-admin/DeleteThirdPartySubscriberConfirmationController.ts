import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserManagementService } from '../../service/UserManagementService';
import * as url from 'url';
import { ThirdPartyRequests } from '../../resources/requests/ThirdPartyRequests';

const thirdPartyRequests = new ThirdPartyRequests();
const userManagementService = new UserManagementService();

export default class DeleteThirdPartySubscriberConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userId = req.query.userId as string;
        const thirdPartySubscriber = await thirdPartyRequests.getThirdPartySubscriberByUserId(
            userId,
            req.user['userId']
        );
        res.render('system-admin/delete-third-party-subscriber-confirmation', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-third-party-subscriber-confirmation']),
            thirdPartySubscriber,
            userId,
            noOptionError: false,
            failedRequestError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const userId = req.body.user as string;
        const thirdPartySubscriber = await thirdPartyRequests.getThirdPartySubscriberByUserId(
            userId,
            req.user['userId']
        );
        if (req.body['delete-subscriber-confirm'] === 'yes') {
            const response = await thirdPartyRequests.deleteThirdPartySubscriber(userId, req.user['userId']);
            if (response) {
                await userManagementService.auditAction(
                    req.user,
                    'DELETE_THIRD_PARTY_SUBSCRIBER',
                    `Third party subscriber with id ${userId} has been deleted`
                );
                res.redirect('/delete-third-party-subscriber-success');
            } else {
                res.render('system-admin/delete-third-party-subscriber-confirmation', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-third-party-subscriber-confirmation']),
                    thirdPartySubscriber,
                    userId,
                    noOptionError: false,
                    failedRequestError: true,
                });
            }
        } else if (req.body['delete-subscriber-confirm'] === 'no') {
            res.redirect(
                url.format({
                    pathname: '/manage-third-party-subscribers/view',
                    query: { userId: userId },
                })
            );
        } else {
            res.render('system-admin/delete-third-party-subscriber-confirmation', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-third-party-subscriber-confirmation']),
                thirdPartySubscriber,
                userId,
                noOptionError: true,
                failedRequestError: false,
            });
        }
    }
}
