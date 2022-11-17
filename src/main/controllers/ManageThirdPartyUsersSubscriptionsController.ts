import {PipRequest} from "../models/request/PipRequest";
import {Response} from "express";
import {cloneDeep} from 'lodash';
import {AccountService} from "../service/accountService";
import {SubscriptionService} from "../service/subscriptionService";
import {PublicationService} from "../service/publicationService";

const accountService = new AccountService();
const subscriptionsService = new SubscriptionService();
const publicationService = new PublicationService();

export default class ManageThirdPartyUsersSubscriptionsController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    if (req.query['userId']) {

      let user = await accountService.getUserById(req.query['userId'])
      const subscriptions = await subscriptionsService.getSubscriptionsByUser(user.userId)
      let listTypes = await publicationService.getListTypes();

      let subscriptionChannels = await subscriptionsService.retrieveChannels();

      subscriptionChannels = subscriptionChannels.filter(channel => channel !== "EMAIL");

      const items = [];
      subscriptionChannels.forEach(channel => {
        items.push({
         "value": channel,
         "text": channel,
         "checked": subscriptionChannels.length == 1
           || subscriptions.listTypeSubscriptions.length == 0
           || subscriptions.listTypeSubscriptions[0].channel === channel
        });
      })

      let formattedListTypes = {};

      listTypes = new Map([...listTypes.entries()].sort());
      for (const [listName, listDetails] of listTypes) {
        formattedListTypes[listName] = {
          listFriendlyName: listDetails.friendlyName,
          checked: subscriptions.listTypeSubscriptions.filter(listType => listType['listType'] === listName).length > 0
        };
      }

      res.render('manage-third-party-users-subscriptions', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-users-subscriptions']),
        listTypes: formattedListTypes,
        userId: req.query['userId'],
        channelItems: items
      });
    } else {
      //Need to do something if userId is not supplied
    }
  }

  public async post(req: PipRequest, res: Response): Promise<void> {

    let selectedUser = req.body['userId'];
    let selectedChannel = req.body['channel'];
    let selectedListTypes = req.body['list-selections[]'] ? req.body['list-selections[]'] : [];

    if (selectedChannel && selectedUser) {
      const currentSubscriptions = await subscriptionsService.getSubscriptionsByUser(selectedUser);
      currentSubscriptions.listTypeSubscriptions.forEach((sub) => {

        if (!selectedListTypes.includes(sub.listType)) {
          subscriptionsService.unsubscribe(sub.subscriptionId);
        } else {
          if (sub.channel !== selectedChannel) {
            subscriptionsService.createdThirdPartySubscription(selectedUser, sub.listType, selectedChannel);
          }

          selectedListTypes.filter(item => item !== sub.listType);
        }
      })

      selectedListTypes.forEach(listType => {
        subscriptionsService.createdThirdPartySubscription(selectedUser, listType, selectedChannel);
      })

      res.render('manage-third-party-users-subscriptions-confirm', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-users-subscriptions-confirm'])
      });
    }

  }

}
