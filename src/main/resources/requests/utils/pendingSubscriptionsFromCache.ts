const { redisClient } = require('../../../cacheManager');

export class PendingSubscriptionsFromCache {
    public async setPendingSubscriptions(subscriptions, subscriptionType, userId): Promise<void> {
        if (redisClient.status === 'ready') {
            let subscriptionsSet = [];
            const rawData = await redisClient.get(`pending-${subscriptionType}-subscriptions-${userId}`);
            const cachedResults = JSON.parse(rawData);
            if (cachedResults && cachedResults.length) {
                subscriptionsSet = cachedResults;
            }
            subscriptions.forEach(subscription => {
                if (subscriptionType === 'courts') {
                    this.addToSubscriptionSet(subscription, 'locationId', subscriptionsSet);
                } else {
                    if (subscription.urnSearch) {
                        this.addToSubscriptionSet(subscription, 'caseUrn', subscriptionsSet);
                    } else {
                        this.addToSubscriptionSet(subscription, 'caseNumber', subscriptionsSet);
                    }
                }
            });
            await redisClient.set(
                `pending-${subscriptionType}-subscriptions-${userId}`,
                JSON.stringify(subscriptionsSet)
            );
        }
    }

    public async getPendingSubscriptions(userId, type): Promise<any[]> {
        let cacheResult = [];
        if (redisClient.status === 'ready' && userId) {
            cacheResult = JSON.parse(await redisClient.get(`pending-${type}-subscriptions-${userId}`));
        }
        return cacheResult;
    }

    // @param removeObject - post data object {case-number: 'id'} || {case-urn: 'id'} || {court: 'id'}
    public async removeFromCache(removeObject, userId): Promise<void> {
        if (redisClient.status === 'ready' && userId) {
            if (removeObject['case-number'] || removeObject['case-urn']) {
                const cachedCases = await this.getPendingSubscriptions(userId, 'cases');
                cachedCases.forEach((item, index) => {
                    if (removeObject['case-number']) {
                        this.removeFromSubscriptionSet(
                            item.caseNumber,
                            removeObject['case-number'],
                            index,
                            cachedCases
                        );
                    } else {
                        this.removeFromSubscriptionSet(item.caseUrn, removeObject['case-urn'], index, cachedCases);
                    }
                });
                redisClient.set(`pending-cases-subscriptions-${userId}`, JSON.stringify(cachedCases));
            }

            // as SJP locationId = 0 removeObject.court = 0 is evaluated as false, hence or (||) check
            if (removeObject.court || removeObject.court === 0) {
                const cachedCourts = await this.getPendingSubscriptions(userId, 'courts');
                const filteredCourts = cachedCourts.filter(court => court.locationId !== parseInt(removeObject.court));
                redisClient.set(`pending-courts-subscriptions-${userId}`, JSON.stringify(filteredCourts));
            }
        }
    }

    private addToSubscriptionSet(subscription, filter, subscriptionsSet) {
        if (
            !subscriptionsSet.some(
                cached => cached[filter] === subscription[filter] && cached['urnSearch'] === subscription['urnSearch']
            )
        ) {
            subscriptionsSet.push(subscription);
        }
    }

    private removeFromSubscriptionSet(itemCase, caseToRemove, index, subscriptionsSet) {
        if (itemCase === caseToRemove) {
            subscriptionsSet.splice(index, 1);
        }
    }
}
