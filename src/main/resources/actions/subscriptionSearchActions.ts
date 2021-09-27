import fs from 'fs';
import path from 'path';

export class SubscriptionSearchActions {
  mocksPath = '../mocks/';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'subscriptionCaseList.json'), 'utf-8');

  getSubscriptionCaseDetails(caseReferenceNo: string): object[] {
    const subscriptionCasesData = JSON.parse(this.rawData);
    const subscriptionCase = subscriptionCasesData?.results.filter((subscriptionCase) => subscriptionCase.referenceNo === caseReferenceNo);
    if (subscriptionCase.length) {
      return subscriptionCase;
    } else {
      console.log(`Subscription Case with reference ${caseReferenceNo} does not exist`);
      return null;
    }
  }
}
