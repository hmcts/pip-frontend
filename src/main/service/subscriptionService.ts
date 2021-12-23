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

  private generateCaseTableRows(subscriptions: Subscription[]): any[] {
    const caseRows = [];
    if (subscriptions.length) {
      subscriptions.forEach((subscription) => {
        if (subscription.caseSubscriptions.length) {
          subscription.caseSubscriptions.forEach((caseSubscription) => {
            caseRows.push(
              [
                {
                  text: caseSubscription.caseName,
                },
                {
                  text: caseSubscription.urn,
                },
                {
                  text: moment(subscription.createdDate).format('D MMM YYYY'),
                },
                {
                  html: '<a href=\'#\'>Unsubscribe</a>',
                  format: 'numeric',
                },
              ],
            );
          })
        }
      });
    }
    return caseRows;
  }

  private generateCourtTableRows(subscriptions: Subscription[]): any[] {
    const courtRows = [];
    if (subscriptions.length) {
      subscriptions.forEach((subscription) => {
        if (subscription.courtSubscriptions.length) {
          subscription.courtSubscriptions.forEach((courtSubscription) => {
            courtRows.push([
              {
                text: courtSubscription.name,
              },
              {
                text: moment(subscription.createdDate).format('D MMM YYYY'),
              },
              {
                html: '<a href=\'#\'>Unsubscribe</a>',
                format: 'numeric',
              },
            ]);
          })
        }
      });
    }
    return courtRows;
  }
}
