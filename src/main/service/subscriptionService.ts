import moment from 'moment';
import {SubscriptionRequests} from '../resources/requests/subscriptionRequests';
import {CaseSubscription} from '../models/caseSubscription';

const subscriptionRequests = new SubscriptionRequests();

export class SubscriptionService {

  public async generateCaseTableRows(userid: number): Promise<any[]> {
    const subscriptionData = await subscriptionRequests.getUserSubscriptions(userid);
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

  public async generateCourtTableRows(userId: number): Promise<any[]> {
    const subscriptionData = await subscriptionRequests.getUserSubscriptions(userId);
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

}
