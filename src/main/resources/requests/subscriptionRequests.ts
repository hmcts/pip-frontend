import {dataManagementApi, subscriptionManagementApi} from './utils/axiosConfig';
import {CaseSubscription} from '../../models/caseSubscription';
import {Subscription} from '../../models/subscription';

export class SubscriptionRequests {

  public async getUserSubscriptions(userId: number): Promise<Subscription> {
    try {
      return await subscriptionManagementApi.get(`/subscription/user/${userId}`) as Subscription;
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

  public async getSubscriptionByUrn(urnNumber: string): Promise<CaseSubscription> {
    try {
      const response = await dataManagementApi.get(`/hearings/urn/${urnNumber}`);
      return response.data;
    }  catch (error) {
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
