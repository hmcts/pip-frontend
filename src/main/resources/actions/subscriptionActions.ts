import fs from 'fs';
import path from 'path';
import moment from 'moment';

export class SubscriptionActions {
  mocksPath = '../mocks/';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'userSubscriptions.json'), 'utf-8');
  userId = 2;

  getUserSubscriptions(userId: number): any {
    const subscriptionsData = JSON.parse(this.rawData);
    const userSubscription = subscriptionsData?.results.filter((user) => user.userId === userId);
    if (userSubscription.length) {
      return userSubscription[0];
    } else {
      console.log(`User with id ${userId} does not exist`);
      return null;
    }
  }

  generateCaseTableRows(): any[] {
    const userSubscriptions = this.getUserSubscriptions(this.userId);
    const caseRows = [];
    const caseSubscriptions = userSubscriptions.caseSubscriptions;
    if (caseSubscriptions.length) {
      caseSubscriptions.forEach((subscription) => {
        caseRows.push(
          [
            {
              text: subscription.name,
              classes: 'govuk-!-width-one-third',
            },
            {
              text: subscription.reference,
              classes: 'govuk-!-width-one-third',
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

  generateCourtTableRows(): any[] {
    const userSubscriptions = this.getUserSubscriptions(this.userId);
    const courtRows = [];
    const courtSubscriptions = userSubscriptions.courtSubscriptions;
    if (courtSubscriptions.length) {
      courtSubscriptions.forEach((subscription) => {
        courtRows.push([
          {
            text: subscription.name,
            classes: 'govuk-!-width-two-thirds',
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
