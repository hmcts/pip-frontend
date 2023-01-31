import { SubscriptionService } from './subscriptionService';
import { SubscriptionRequests } from '../resources/requests/subscriptionRequests';
import { DateTime } from 'luxon';
import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import { Logger } from '@hmcts/nodejs-logging';

/**
 * This service class handles support methods for dealing with third parties
 */
export class ThirdPartyService {
    logger = Logger.getLogger('thirdPartyService');

    subscriptionService = new SubscriptionService();
    subscriptionRequests = new SubscriptionRequests();
    accountManagementRequests = new AccountManagementRequests();

    /**
     * Generates a set of list types, with friendly names for Third Party subscriptions
     * @param listTypes The available list types to subscribe to.
     * @param subscriptions The current third party subscriptions.
     */
    public generateListTypes(listTypes, subscriptions) {
        const formattedListTypes = {};

        listTypes = new Map([...listTypes.entries()].sort());
        for (const [listName, listDetails] of listTypes) {
            formattedListTypes[listName] = {
                listFriendlyName: listDetails.friendlyName,
                checked:
                    subscriptions.listTypeSubscriptions.filter(listType => listType['listType'] === listName).length >
                    0,
            };
        }

        return formattedListTypes;
    }

    /**
     * Generates a list of available channels for Radio buttons, for Third Parties
     * @param subscriptionChannels The list of available subscription channels.
     * @param subscriptions The current third party subscriptions.
     */
    public generateAvailableChannels(subscriptionChannels, subscriptions) {
        const items = [];
        let hasBeenChecked = false;

        subscriptionChannels.forEach(channel => {
            if (
                subscriptions.listTypeSubscriptions.length > 0 &&
                subscriptions.listTypeSubscriptions[0].channel === channel
            ) {
                hasBeenChecked = true;
            }
            items.push({
                value: channel,
                text: channel,
                checked:
                    subscriptions.listTypeSubscriptions.length > 0 &&
                    subscriptions.listTypeSubscriptions[0].channel === channel,
            });
        });

        if (!hasBeenChecked && items.length > 0) {
            items[0]['checked'] = true;
        }

        return items;
    }

    /**
     * This method handles the update of third party subscriptions.
     * @oaram adminUserID The admin who is performing the action
     * @param selectedUser The user ID of the user to update.
     * @param selectedListTypes The list types that have been selected.
     * @param selectedChannel The channel that has been selected.
     */
    public async handleThirdPartySubscriptionUpdate(adminUserId, selectedUser, selectedListTypes, selectedChannel) {
        selectedListTypes = selectedListTypes ? selectedListTypes : [];
        selectedListTypes = Array.isArray(selectedListTypes) ? selectedListTypes : Array.of(selectedListTypes);

        const currentSubscriptions = await this.subscriptionService.getSubscriptionsByUser(selectedUser);
        currentSubscriptions.listTypeSubscriptions.forEach(sub => {
            if (!selectedListTypes.includes(sub.listType)) {
                this.logger.info(
                    'Unsubscribing ' + selectedUser + ' for list type ' + sub.listType + ' by admin ' + adminUserId
                );

                this.subscriptionService.unsubscribe(sub.subscriptionId, adminUserId);
            } else {
                if (sub.channel !== selectedChannel) {
                    this.logger.info(
                        'Updating subscription for ' +
                            selectedUser +
                            ' for list type ' +
                            sub.listType +
                            ' by admin ' +
                            adminUserId
                    );
                    this.createdThirdPartySubscription(selectedUser, sub.listType, selectedChannel, adminUserId);
                }

                selectedListTypes.filter(item => item !== sub.listType);
            }
        });

        selectedListTypes.forEach(listType => {
            this.logger.info(
                'Creating subscription for ' + selectedUser + ' for list type ' + listType + ' by admin ' + adminUserId
            );
            this.createdThirdPartySubscription(adminUserId, selectedUser, listType, selectedChannel);
        });
    }

    /**
     * Handles creation of new subscriptions for third parties.
     * @param adminId The admin who is making the request.
     * @param userId The user ID to add a subscription for.
     * @param listType The list type to subscribe to.
     * @param channel The channel for the subscription.
     */
    public createdThirdPartySubscription(adminId, userId, listType, channel) {
        const subscription = {
            channel: channel,
            searchType: 'LIST_TYPE',
            searchValue: listType,
            userId: userId,
        };

        this.subscriptionRequests.subscribe(subscription, adminId);
    }

    /**
     * Service which gets third party accounts from the backend.
     */
    public async getThirdPartyAccounts(adminUserId): Promise<any> {
        const returnedAccounts = await this.accountManagementRequests.getThirdPartyAccounts(adminUserId);
        for (const account of returnedAccounts) {
            account['createdDate'] = DateTime.fromISO(account['createdDate'], {
                zone: 'Europe/London',
            }).toFormat('dd MMMM yyyy');
        }
        return returnedAccounts;
    }

    /**
     * Method which retrieves a user by their PI User ID.
     *
     * If the user is not a third party role, then this will return null.
     * It also sets the created date of the user to the right format.
     */
    public async getThirdPartyUserById(userId, adminUserId): Promise<any> {
        const account = await this.accountManagementRequests.getUserByUserId(userId, adminUserId);
        if (account && account.userProvenance === 'THIRD_PARTY') {
            account['createdDate'] = DateTime.fromISO(account['createdDate']).toFormat('dd MMMM yyyy');
            return account;
        }
        return null;
    }
}
