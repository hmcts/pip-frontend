import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';
import { UserManagementService } from '../../service/UserManagementService';

const thirdPartyService = new ThirdPartyService();
const userManagementService = new UserManagementService();

export default class ManageThirdPartySubscribersViewController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.query['userId']) {
            const user = await thirdPartyService.getThirdPartySubscriberById(req.query['userId'], req.user['userId']);
            if (user) {
                await userManagementService.auditAction(
                    req.user,
                    'MANAGE_THIRD_PARTY_SUBSCRIBER_VIEW',
                    'User requested to view third party subscriber with id: ' + user.userId
                );

                res.render('system-admin/manage-third-party-subscribers-view', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscribers-view']),
                    userDetails: user,
                    healthCheck: {},
                });

                return;
            }
        }

        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const userId = req.query['userId'] as string;

        if (userId) {
            const healthCheck = await ManageThirdPartySubscribersViewController.testConnection(
                userId,
                req.user['userId']
            );
            const user = await thirdPartyService.getThirdPartySubscriberById(userId, req.user['userId']);
            if (user) {
                res.render('system-admin/manage-third-party-subscribers-view', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscribers-view']),
                    userDetails: user,
                    healthCheck,
                });
                return;
            }
        }

        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    private static async testConnection(userId, requester): Promise<any> {
        const oauthConfiguration = await thirdPartyService.getThirdPartySubscriberOauthConfigByUserId(
            userId,
            requester
        );
        if (oauthConfiguration === null) {
            return {
                missingConfigurationError: true,
            };
        }
        const response = await thirdPartyService.thirdPartyConfigurationHealthCheck(userId, requester);
        if (response) {
            if (typeof response === 'string') {
                return {
                    thirdPartyErrorMessage: response,
                };
            } else {
                return {
                    success: true,
                };
            }
        }
        return {
            thirdPartyRequestError: true,
        };
    }
}
