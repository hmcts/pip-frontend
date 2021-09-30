import {PipApi} from '../../utils/PipApi';
import Any = jasmine.Any;

export class SubscriptionCaseSearchActions {

  constructor(private readonly api: PipApi) {}

  public async getSubscriptionCaseDetails(caseReferenceNo): Promise<Array<Any>> {
    const subscriptionCaseDetails = await this.api.getSubscriptionByCaseReference(caseReferenceNo);

    if (subscriptionCaseDetails) {
      return subscriptionCaseDetails;
    } else {
      console.log(`Subscription with case reference ${caseReferenceNo} does not exist`);
      return null;
    }

  }
}
