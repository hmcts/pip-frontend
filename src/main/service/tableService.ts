import moment from 'moment';
import { SubscriptionActions } from '../resources/actions/subscriptionActions';

export class TableService {
  subscriptionActions = new SubscriptionActions();
  
  generateCaseTableRows(userId: number): any[] {
    const userSubscriptions = this.subscriptionActions.getUserSubscriptions(userId);
    const caseRows = [];
    const caseSubscriptions = userSubscriptions.caseSubscriptions;
    if (caseSubscriptions.length) {
      caseSubscriptions.forEach((subscription) => {
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

  generateCourtTableRows(userId): any[] {
    const userSubscriptions = this.subscriptionActions.getUserSubscriptions(userId);
    const courtRows = [];
    const courtSubscriptions = userSubscriptions.courtSubscriptions;
    if (courtSubscriptions.length) {
      courtSubscriptions.forEach((subscription) => {
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
