import moment from 'moment';
import {SubscriptionRequests} from '../resources/requests/subscriptionRequests';
import {CaseSubscription} from '../models/caseSubscription';
import {Subscription} from '../models/subscription';

const subscriptionRequests = new SubscriptionRequests();

export class SubscriptionService {

  public async generateSubscriptionsTableRows(userid: number): Promise<any> {
    const subscriptionData = await subscriptionRequests.getUserSubscriptions(userid);
    const cases = {
      cases: [],
      courts: [],
    };
    if (subscriptionData) {
      cases.cases = this.generateCaseTableRows(subscriptionData);
      cases.courts = this.generateCourtTableRows(subscriptionData);
    }

    return cases;
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

  private generateCaseTableRows(subscriptionData: Subscription): any[] {
    const caseRows = [];
    if (subscriptionData.caseSubscriptions.length) {
      subscriptionData.caseSubscriptions.forEach((subscription) => {
        //const date = moment.unix(subscription.dateAdded).format('D MMM YYYY');
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

  private generateCourtTableRows(subscriptionData: Subscription): any[] {
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

}
