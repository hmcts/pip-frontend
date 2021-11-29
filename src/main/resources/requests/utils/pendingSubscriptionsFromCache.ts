import {CaseSubscription} from '../../../models/caseSubscription';

const { redisClient } = require('../../../cacheManager');

export class PendingSubscriptionsFromCache {

  public async setPendingSubscriptions(searchResult: Array<CaseSubscription>, user): Promise<void> {
    if (redisClient.status === 'ready') {
      const rawData = await redisClient.get(`pending-subscriptions${user.id}`);
      const cacheResult = JSON.parse(rawData);
      if (cacheResult) {
        searchResult.forEach(hearing => {
          if (cacheResult.filter(x=>x.hearingId === hearing.hearingId).length === 0) {
            cacheResult.push(hearing);
          }
        });
      }
      redisClient.set(`pending-subscriptions${user.id}`, JSON.stringify(cacheResult));
    }
  }

  public async getPendingSubscriptions(user): Promise<Array<CaseSubscription>> {
    let cacheResult = null;
    if (redisClient.status === 'ready' && user) {
      cacheResult = JSON.parse(await redisClient.get(`pending-subscriptions${user.id}`));
    }
    return cacheResult;
  }

  public async clearPendingSubscription(user): Promise<boolean> {
    let subscribed = false;
    if (redisClient.status === 'ready' && user) {
      await redisClient.del(`pending-subscriptions${user.id}`);
      subscribed = true;
    }
    return subscribed;
  }

  public async removeFromCache(id, user): Promise<boolean> {
    let removed = false;
    if (redisClient.status === 'ready' && user) {
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
            removed = true;
          }
        }
        redisClient.set(`pending-subscriptions${user.id}`, JSON.stringify(cacheResult));
      }
    }
    return removed;
  }

}
