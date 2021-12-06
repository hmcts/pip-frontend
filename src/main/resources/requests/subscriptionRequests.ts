import fs from 'fs';
import path from 'path';
import {dataManagementApi, subscriptionManagementApi} from './utils/axiosConfig';
import {CaseSubscription} from '../../models/caseSubscription';
import {Subscription} from '../../models/subscription';

export class SubscriptionRequests {
  mocksPath = '../mocks/';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'userSubscriptions.json'), 'utf-8');

  public async getUserSubscriptions(userId: number): Promise<Subscription> {
    try {
      const response = await subscriptionManagementApi.get(`/subscription/user/${userId}`) as Array<Subscription>;
      const userSubscriptions = response?.filter((user) => user.userId === userId);
      if (userSubscriptions && userSubscriptions.length) {
        return userSubscriptions[0];
      }
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
