import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionService } from '../../service/SubscriptionService';
import { PublicationService } from '../../service/PublicationService';
import { UserManagementService } from '../../service/UserManagementService';
import { CourtelThirdPartyService } from '../../service/CourtelThirdPartyService';

const courtelThirdPartyService = new CourtelThirdPartyService();
const subscriptionsService = new SubscriptionService();
const publicationService = new PublicationService();
const userManagementService = new UserManagementService();

export default class ManageThirdPartyUsersSubscriptionsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.query['userId']) {
            const user = await courtelThirdPartyService.getThirdPartyUserById(req.query['userId'], req.user['userId']);
            const listTypes = publicationService.getListTypes();
            let subscriptionChannels = await subscriptionsService.retrieveChannels(
                req.query['userId'],
                req.user['userId']
            );

            if (user) {
                const subscriptions = await subscriptionsService.getSubscriptionsByUser(user.userId);
                subscriptionChannels = subscriptionChannels.filter(channel => channel !== 'EMAIL');

                res.render('system-admin/manage-third-party-users-subscriptions', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-users-subscriptions']),
                    listTypes: courtelThirdPartyService.generateListTypes(listTypes, subscriptions),
                    userId: req.query['userId'],
                    channelItems: courtelThirdPartyService.generateAvailableChannels(subscriptionChannels, subscriptions),
                });
                return;
            }
        }

        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const selectedUser = req.body['userId'];
        const selectedChannel = req.body['channel'];
        const selectedListTypes = req.body['list-selections[]'];

        if (
            selectedChannel &&
            selectedUser &&
            (await courtelThirdPartyService.getThirdPartyUserById(selectedUser, req.user['userId']))
        ) {
            await courtelThirdPartyService.handleThirdPartySubscriptionUpdate(
                req.user['userId'],
                req.user['userProvenance'],
                selectedUser,
                selectedListTypes,
                selectedChannel
            );
            await userManagementService.auditAction(
                req.user,
                'MANAGE_THIRD_PARTY_USER_SUBSCRIPTIONS',
                'User requested to manage subscriptions of third party user with id: ' + selectedUser
            );

            res.render(
                'system-admin/manage-third-party-users-subscriptions-confirm',
                req.i18n.getDataByLanguage(req.lng)['manage-third-party-users-subscriptions-confirm']
            );
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
