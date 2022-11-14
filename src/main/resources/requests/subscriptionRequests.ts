import { subscriptionManagementApi } from './utils/axiosConfig';
import { UserSubscriptions } from '../../models/UserSubscriptions';

export class SubscriptionRequests {
  public async getUserSubscriptions(userId: string): Promise<UserSubscriptions> {
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

  public async unsubscribe(subscriptionId: string): Promise<object> {
    try {
      const response = await subscriptionManagementApi.delete(`/subscription/${subscriptionId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(`Request failed. ${error.request}`);
      } else {
        console.log(`ERROR: ${error.message}`);
      }
      return null;
    }
  }

  public async subscribe(payload): Promise<boolean> {
    try {
      await subscriptionManagementApi.post('/subscription', payload);
      return true;
    } catch (error) {
      if (error.response) {
        console.log('Failed to create subscription');
      } else if (error.request) {
        console.log('Request failed.');
      } else {
        console.log('Unknown error while creating a subscription');
      }
    }
    return false;
  }

  public async configureListTypeForLocationSubscriptions(userId, payload): Promise<boolean> {
    try {
      await subscriptionManagementApi.put(`/subscription/configure-list-types/${userId}`, payload);
      return true;
    } catch (error) {
      if (error.response) {
        console.log('Failed to configure list type for location subscription');
      } else if (error.request) {
        console.log('Request failed.');
      } else {
        console.log('Unknown error while configuring list type for location subscription');
      }
    }
    return false;
  }
}
