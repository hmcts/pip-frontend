import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionService } from '../service/subscriptionService';
import { ThirdPartyService } from '../service/thirdPartyService';
import { UserManagementService } from '../service/userManagementService';

const thirdPartyService = new ThirdPartyService();
const subscriptionsService = new SubscriptionService();
const userManagementService = new UserManagementService();

export default class ManageThirdPartyUsersViewController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.query['userId']) {
            const user = await thirdPartyService.getThirdPartyUserById(req.query['userId'], req.user['userId']);
            if (user) {
                const subscriptions = await subscriptionsService.getSubscriptionsByUser(user.userId);

                await userManagementService.auditAction(
                    req.user,
                    'MANAGE_THIRD_PARTY_USER_VIEW',
                    'User requested to view third party user with id: ' + user.userId
                );

                res.render('manage-third-party-users-view', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-users-view']),
                    userDetails: user,
                    numberOfSubscriptions: subscriptions.listTypeSubscriptions.length,
                    subscriptionsChannel:
                        subscriptions.listTypeSubscriptions.length > 0
                            ? subscriptions.listTypeSubscriptions[0].channel
                            : '',
                });

                return;
            }
        }

        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
}
