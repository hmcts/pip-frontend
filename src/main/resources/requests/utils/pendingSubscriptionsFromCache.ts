const { redisClient } = require('../../../cacheManager');

export class PendingSubscriptionsFromCache {
  public async setPendingSubscriptions(subscriptions, subscriptionType, userId): Promise<void> {
    const filter = subscriptionType === 'courts' ? 'locationId' : 'caseNumber';
    if (redisClient.status === 'ready') {
      let subscriptionsSet = [];
      const rawData = await redisClient.get(`pending-${subscriptionType}-subscriptions-${userId}`);
      const cachedResults = JSON.parse(rawData);
      if (cachedResults && cachedResults.length) {
        subscriptionsSet = cachedResults;
      }
      subscriptions.forEach(subscription => {
        // check if already in the cache
        if (!subscriptionsSet.some(cached => cached[filter] === subscription[filter])) {
          subscriptionsSet.push(subscription);
        }
      });
      await redisClient.set(`pending-${subscriptionType}-subscriptions-${userId}`, JSON.stringify(subscriptionsSet));
    }
  }

  public async getPendingSubscriptions(userId, type): Promise<any[]> {
    let cacheResult = [];
    if (redisClient.status === 'ready' && userId) {
      cacheResult = JSON.parse(await redisClient.get(`pending-${type}-subscriptions-${userId}`));
    }
    return cacheResult;
  }

  // @param removeObject - post data object {case: 'id'} || {court: 'id'}
  public async removeFromCache(removeObject, userId): Promise<void> {
    if (redisClient.status === 'ready' && userId) {
      if (removeObject.case) {
        const cachedCases = await this.getPendingSubscriptions(userId, 'cases');
        const filteredCases = cachedCases.filter(c => c.caseNumber !== removeObject.case);
        redisClient.set(`pending-cases-subscriptions-${userId}`, JSON.stringify(filteredCases));
      }

      // as SJP locationId = 0 removeObject.court = 0 is evaluated as false, hence or (||) check
      if (removeObject.court || removeObject.court === 0) {
        const cachedCourts = await this.getPendingSubscriptions(userId, 'courts');
        const filteredCourts = cachedCourts.filter(court => court.locationId !== parseInt(removeObject.court));
        redisClient.set(`pending-courts-subscriptions-${userId}`, JSON.stringify(filteredCourts));
      }
    }
  }
}
