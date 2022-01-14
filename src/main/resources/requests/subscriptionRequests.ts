import { dataManagementApi, subscriptionManagementApi } from './utils/axiosConfig';
import { Hearing } from '../../models/hearing';
import { Subscription } from '../../models/subscription';

export class SubscriptionRequests {
  public async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    try {
      const response = await subscriptionManagementApi.get(`/subscription/user/${userId}`);
      return response.data;
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

  public async getSubscriptionByUrn(urnNumber: string): Promise<Hearing> {
    try {
      const response = await dataManagementApi.get(`/hearings/urn/${urnNumber}`);
      return response.data;
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

  public async subscribe(payload): Promise<boolean> {
    try {
      await subscriptionManagementApi.post('/subscription', payload);
      return true;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(`Request failed. ${error.request}`);
      } else {
        console.log(`ERROR: ${error.message}`);
      }
    }
    return false;
  }

}
