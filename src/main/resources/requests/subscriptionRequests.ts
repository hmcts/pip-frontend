import fs from 'fs';
import path from 'path';
import {dataManagementApi} from './utils/axiosConfig';
import {CaseSubscription} from '../../models/caseSubscription';
const { redisClient } = require('../../cacheManager');


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

  public async setPendingSubscriptions(searchResult: Array<CaseSubscription>, user): Promise<void> {
    if (redisClient.status === 'ready') {
      const cacheResult = JSON.parse(await redisClient.get(`pending-subscriptions${user.id}`));
      if (cacheResult) {
        searchResult.forEach(hearing => {
          if (cacheResult.filter(x=>x.hearingId === hearing.hearingId).length === 0) {
            cacheResult.push(hearing);
          }
        });
        redisClient.set(`pending-subscriptions${user.id}`, JSON.stringify(cacheResult));
      }
      else {
        redisClient.set(`pending-subscriptions${user.id}`, JSON.stringify(searchResult));
      }
    }
  }

  public async getPendingSubscriptions(user): Promise<Array<CaseSubscription>> {
    if (redisClient.status === 'ready') {
      return JSON.parse(await redisClient.get(`pending-subscriptions${user.id}`));
    }
  }

  public async subscribe(searchResult: Array<CaseSubscription>, user): Promise<boolean> {
    if (redisClient.status === 'ready') {

      //TODO: call api to subscribe and clear the cache
      await redisClient.del(`pending-subscriptions${user.id}`);
      return true;
    }
  }

  public async removeFromCache(id, user): Promise<boolean> {
    if (redisClient.status === 'ready') {
      let result = null;
      const cacheResult = JSON.parse(await redisClient.get(`pending-subscriptions${user.id}`));
      if (cacheResult) {

        cacheResult.forEach(x=>{
          if (x.hearingId === id)
            result = x;
        });

        if (result) {
          const index = cacheResult.indexOf(result, 0);
          if (index > -1) {
            cacheResult.splice(index, 1);
          }
        }

        redisClient.set(`pending-subscriptions${user.id}`, JSON.stringify(cacheResult));
      }
    }
    return true;
  }
}
