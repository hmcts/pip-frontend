import { subscriptionManagementApi } from './utils/axiosConfig';
import { Subscription } from '../../models/subscription';

export class SubscriptionRequests {

  public async getUserSubscriptions(userId: number): Promise<Subscription> {
    try {
      return await subscriptionManagementApi.get(`/subscription/user/${userId}`);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(`Request failed. ${error.request}`);
      } else {
        console.log(`ERROR: ${error.message}`);
      }
    }
    return null;
  }
}
