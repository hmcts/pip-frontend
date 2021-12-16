import moment from 'moment';
import { SubscriptionRequests } from '../resources/requests/subscriptionRequests';
import { Subscription } from '../models/subscription';

const subscriptionRequests = new SubscriptionRequests();

export class SubscriptionService {
  public async generateSubscriptionsTableRows(userid: number): Promise<any> {
    const subscriptions = await subscriptionRequests.getUserSubscriptions(userid);
    const rows = {
      cases: [],
      courts: [],
    };
    if (subscriptions) {
      rows.cases = this.generateCaseTableRows(subscriptions);
      rows.courts = this.generateCourtTableRows(subscriptions);
    }

    return rows;
  }

  private generateCaseTableRows(subscriptions: Subscription): any[] {
    const caseRows = [];
    if (subscriptions.caseSubscriptions.length) {
      subscriptions.caseSubscriptions.forEach((subscription) => {
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

  private generateCourtTableRows(subscriptions: Subscription): any[] {
    const courtRows = [];
    if (subscriptions.courtSubscriptions.length) {
      subscriptions.courtSubscriptions.forEach((subscription) => {
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
