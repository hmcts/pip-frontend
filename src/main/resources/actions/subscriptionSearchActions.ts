import {PipApi} from '../../utils/PipApi';
import {Subscription} from '../../models/subscription';

export class SubscriptionSearchActions {

  constructor(private readonly api: PipApi) {}


  public async getSubscriptionUrnDetails(urn): Promise<Array<Subscription>> {
    const subscriptions = await this.api.getSubscriptionByUrn(urn);

    if (subscriptions) {
      return subscriptions;
    } else {
      console.log(`Subscription with urn ${urn} does not exist`);
      return [];
    }

  }
}
