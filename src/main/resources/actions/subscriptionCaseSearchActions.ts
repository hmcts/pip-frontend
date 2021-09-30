import {PipApi} from '../../utils/PipApi';
import Any = jasmine.Any;

export class SubscriptionCaseSearchActions {

  constructor(private readonly api: PipApi) {}

  public async getSubscriptionCaseDetails(caseReferenceNo): Promise<Array<Any>> {
    const subscriptions = await this.api.getSubscriptionByCaseReference(caseReferenceNo);

    if (subscriptions) {
      return subscriptions;
    } else {
      console.log(`Subscription with case reference ${caseReferenceNo} does not exist`);
      return null;
    }

  }
}
