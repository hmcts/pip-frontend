import moment from 'moment';
import {SubscriptionRequests} from '../resources/requests/subscriptionRequests';
import {CaseSubscription} from '../models/caseSubscription';
import { PendingSubscriptionsFromCache } from '../resources/requests/utils/pendingSubscriptionsFromCache';

const subscriptionRequests = new SubscriptionRequests();
const pendingSubscriptionsFromCache = new PendingSubscriptionsFromCache();

export class SubscriptionService {

  generateCaseTableRows(userid: number): any[] {
    const subscriptionData = subscriptionRequests.getUserSubscriptions(userid);
    const caseRows = [];
    if (subscriptionData.caseSubscriptions.length) {
      subscriptionData.caseSubscriptions.forEach((subscription) => {
        caseRows.push(
          [
            {
              text: subscription.name,
            },
            {
              text: subscription.reference,
            },
            {
              text: moment.unix(subscription.dateAdded).format('D MMM YYYY'),
            },
            {
              html: '<a href=\'#\'>Unsubscribe</a>',
              format: 'numeric',
            },
          ],
        );
      });
    }
    return caseRows;
  }

  generateCourtTableRows(userId: number): any[] {
    const subscriptionData = subscriptionRequests.getUserSubscriptions(userId);
    const courtRows = [];
    if (subscriptionData.courtSubscriptions.length) {
      subscriptionData.courtSubscriptions.forEach((subscription) => {
        courtRows.push([
          {
            text: subscription.name,
          },
          {
            text: moment.unix(subscription.dateAdded).format('D MMM YYYY'),
          },
          {
            html: '<a href=\'#\'>Unsubscribe</a>',
            format: 'numeric',
          },
        ]);
      });
    }
    return courtRows;
  }

  public async getSubscriptionUrnDetails(urn: string): Promise<CaseSubscription> {
    const subscriptions = await subscriptionRequests.getSubscriptionByUrn(urn);

    if (subscriptions) {
      return subscriptions;
    } else {
      console.log(`Subscription with urn ${urn} does not exist`);
      return null;
    }
  }

  public setPendingSubscriptions(searchResult, user): boolean {
    pendingSubscriptionsFromCache.setPendingSubscriptions(searchResult, user);
    return true;
  }

  public async getPendingSubscriptions(user): Promise<Array<CaseSubscription>> {
    return await pendingSubscriptionsFromCache.getPendingSubscriptions(user);
  }

  public async subscribe(searchResult, user): Promise<boolean> {
    if (await subscriptionRequests.subscribe(searchResult,user)) {
      return await pendingSubscriptionsFromCache.clearPendingSubscription(searchResult, user);
    }
    return false;
  }

  public async removeFromCache(id, user): Promise<boolean> {
    return await pendingSubscriptionsFromCache.removeFromCache(id, user);
  }
}
