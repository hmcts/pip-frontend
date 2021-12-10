import fs from 'fs';
import path from 'path';
import {dataManagementApi, subscriptionManagementApi} from './utils/axiosConfig';
import {CaseSubscription} from '../../models/caseSubscription';
import {Subscription} from '../../models/subscription';
import {SubscriptionSearchType} from '../../models/SubscriptionSearchType';

export class SubscriptionRequests {
  mocksPath = '../mocks/';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'userSubscriptions.json'), 'utf-8');

  public async getUserSubscriptions(userId: number): Promise<Subscription> {
    try {
      const subscriptionResults: Subscription = {
        userId: userId,
        userEmail: '',
        caseSubscriptions: [],
        courtSubscriptions: [],
      };
      const response = await subscriptionManagementApi.get(`/subscription/user/${userId}`);
      const userSubscriptions = response.data;
      //const userSubscriptions = JSON.parse(this.rawData2);
      if (userSubscriptions && userSubscriptions.length) {
        let subscription: CaseSubscription;
        let caseSubs;
        // get case details for each user subscription
        for (const sub of userSubscriptions) {
          caseSubs = null;
          switch (sub.searchType) {
            case SubscriptionSearchType.CASE_URN:
              subscription = await this.getSubscriptionByUrn(sub.searchValue);
              caseSubs = {
                name: subscription.caseName,
                reference: subscription.caseNumber,
                urn: subscription.urn,
                dateAdded: subscription.date,
              };

              break;
            case SubscriptionSearchType.CASE_ID:
              break;
            case SubscriptionSearchType.COURT_ID:
              break;
          }
          if (caseSubs) {
            subscriptionResults.caseSubscriptions.push(caseSubs);
          }
        }
        return subscriptionResults;
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
