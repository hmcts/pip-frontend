import {SubscriptionService} from './subscriptionService';
import {SubscriptionRequests} from '../resources/requests/subscriptionRequests';
import moment from 'moment/moment';
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';

/**
 * This service class handles support methods for dealing with third parties
 */
export class ThirdPartyService {

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
        checked: subscriptions.listTypeSubscriptions.filter(listType => listType['listType'] === listName).length > 0,
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
      if (subscriptions.listTypeSubscriptions.length > 0
        && subscriptions.listTypeSubscriptions[0].channel === channel) {
        hasBeenChecked = true;
      }
      items.push({
        'value': channel,
        'text': channel,
        'checked': subscriptions.listTypeSubscriptions.length > 0
          && subscriptions.listTypeSubscriptions[0].channel === channel,
      });
    });

    if (!hasBeenChecked && items.length > 0) {
      items[0]['checked'] = true;
    }

    return items;
  }

  /**
   * This method handles the update of third party subscriptions.
   * @param selectedUser The user ID of the user to update.
   * @param selectedListTypes The list types that have been selected.
   * @param selectedChannel The channel that has been selected.
   */
  public async handleThirdPartySubscriptionUpdate(selectedUser, selectedListTypes, selectedChannel) {
    selectedListTypes = selectedListTypes ? selectedListTypes : [];
    selectedListTypes = Array.isArray(selectedListTypes) ? selectedListTypes : Array.of(selectedListTypes);

    const currentSubscriptions = await this.subscriptionService.getSubscriptionsByUser(selectedUser);
    currentSubscriptions.listTypeSubscriptions.forEach((sub) => {
      if (!selectedListTypes.includes(sub.listType)) {
        this.subscriptionService.unsubscribe(sub.subscriptionId);
      } else {
        if (sub.channel !== selectedChannel) {
          this.createdThirdPartySubscription(selectedUser, sub.listType, selectedChannel);
        }

        selectedListTypes.filter(item => item !== sub.listType);
      }
    });

    selectedListTypes.forEach(listType => {
      this.createdThirdPartySubscription(selectedUser, listType, selectedChannel);
    });
  }

  /**
   * Handles creation of new subscriptions for third parties.
   * @param userId The user ID to add a subscription for.
   * @param listType The list type to subscribe to.
   * @param channel The channel for the subscription.
   */
  public createdThirdPartySubscription(userId, listType, channel) {
    const subscription = {
      channel: channel,
      searchType: 'LIST_TYPE',
      searchValue: listType,
      userId: userId,
    };

    this.subscriptionRequests.subscribe(subscription);
  }

  /**
   * Service which gets third party accounts from the backend.
   */
  public async getThirdPartyAccounts(): Promise<any> {
    const returnedAccounts = await this.accountManagementRequests.getThirdPartyAccounts();
    for (const account of returnedAccounts) {
      account['createdDate'] = moment.utc(Date.parse(account['createdDate'])).format('DD MMMM YYYY');
    }
    return returnedAccounts;
  }

  /**
   * Method which retrieves a user by their PI User ID.
   *
   * If the user is not a third party role, then this will return null.
   * It also sets the created date of the user to the right format.
   */
  public async getThirdPartyUserById(userId): Promise<any> {
    const account = await this.accountManagementRequests.getUserById(userId);
    if (account && account.userProvenance === 'THIRD_PARTY') {
      account['createdDate'] = moment.utc(Date.parse(account['createdDate'])).format('DD MMMM YYYY');
      return account;
    }
    return null;
  }

}
