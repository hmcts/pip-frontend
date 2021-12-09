import fs from 'fs';
import path from 'path';
import { dataManagementApi, subscriptionManagementApi } from './utils/axiosConfig';
import {CaseSubscription} from '../../models/caseSubscription';

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

  public async getSubscriptionByUrn(urnNumber: string): Promise<CaseSubscription> {
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
}
