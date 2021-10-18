import {PipApi} from '../../utils/PipApi';
import {CaseSubscription} from '../../models/caseSubscription';

export class SubscriptionSearchActions {

  constructor(private readonly api: PipApi) {}


  public async getSubscriptionUrnDetails(urn): Promise<Array<CaseSubscription>> {
    const subscriptions = await this.api.getSubscriptionByUrn(urn);

    if (subscriptions) {
      return subscriptions;
    } else {
      console.log(`Subscription with urn ${urn} does not exist`);
      return [];
    }

  }
}
