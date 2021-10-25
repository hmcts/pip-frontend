import fs from 'fs';
import path from 'path';

export class SubscriptionRequests {
  mocksPath = '../mocks/';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'userSubscriptions.json'), 'utf-8');

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
}
