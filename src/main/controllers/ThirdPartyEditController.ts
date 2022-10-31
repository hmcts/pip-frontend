import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import {cloneDeep} from 'lodash';
import {PublicationService} from '../service/publicationService';
import {SubscriptionService} from '../service/subscriptionService';
import {SubscriptionRequests} from '../resources/requests/subscriptionRequests';
import {AToZHelper} from '../helpers/aToZHelper';

const publicationService = new PublicationService();
const subscriptionService = new SubscriptionService();
const subscriptionRequests = new SubscriptionRequests();

export default class ThirdPartySearchController {
  public async get(req: PipRequest, res: Response): Promise<void> {

    const listTypes = await publicationService.getListTypes();

    const subscriptions = await subscriptionService.getSubscriptionsByUser(req.query['userId'] as string);

    const alphabetisedListTypes = AToZHelper.generateAlphabetObject();

    for (const [listName, listDetails] of listTypes) {
      alphabetisedListTypes[listName.charAt(0).toUpperCase()][listName] = {
        listFriendlyName: listDetails.friendlyName,
        checked: subscriptions.listTypeSubscriptions.filter(listType => listType['listType'] === listName).length > 0,
      };
    }

    let channelName = '';
    if (subscriptions.listTypeSubscriptions.length > 0) {
      channelName = subscriptions.listTypeSubscriptions[0]['channel'];
    }

    res.render('third-party-edit', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['third-party-edit']),
      listTypes: alphabetisedListTypes,
      userId: req.query['userId'],
      channelName: channelName,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    let listTypes = req.body['list-selections[]'];

    if (!Array.isArray(listTypes)) {
      listTypes = [listTypes];
    }

    const subscriptions = await subscriptionService.getSubscriptionsByUser(req.body['userId'] as string);

    for (const listType of listTypes) {
      if (subscriptions.listTypeSubscriptions.filter(
        listTypeSubscription => listTypeSubscription['listType'] == listType).length === 0) {

        await subscriptionRequests.subscribe(subscriptionService.createThirdPartySubscription(listType,
          req.body['channelName'], req.body['userId']));
      }
    }

    for (const listTypeSubscription of subscriptions.listTypeSubscriptions) {
      if (!listTypes.includes(listTypeSubscription['listType'])) {
        await subscriptionService.unsubscribe(listTypeSubscription['subscriptionId']);
      }
    }

    res.redirect('/third-party-search');
  }

}
