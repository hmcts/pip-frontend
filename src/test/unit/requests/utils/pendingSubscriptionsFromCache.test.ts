import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import {PendingSubscriptionsFromCache} from '../../../../main/resources/requests/utils/pendingSubscriptionsFromCache';
const { redisClient } = require('../../../../main/cacheManager');

const mockUser = {
  id : '1',
};
const pendingSubscriptionsFromCache = new PendingSubscriptionsFromCache();


const newHearing = [
  {
    'hearingId': 5,
    'courtId': 50,
    'courtNumber': 1,
    'date': '15/11/2021 10:00:00',
    'judge': 'His Honour Judge A Morley QC',
    'platform': 'In person',
    'caseNumber': 'T485914',
    'caseName': 'Ashely Barnes',
    'urn': 'IBRANE1BVW',
  },
];


const rawData = fs.readFileSync(path.resolve(__dirname, '../../../../main/resources/mocks/caseHearings.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const stub = sinon.stub(redisClient, 'get');
const stubDel = sinon.stub(redisClient, 'del');
sinon.stub(redisClient, 'status').value('ready');

describe('setPendingSubscriptions with valid user', () => {
  stub.withArgs(`pending-subscriptions${mockUser.id}`).resolves(rawData);
  stubDel.withArgs(`pending-subscriptions${mockUser.id}`);

  const set = sinon.spy(redisClient, 'set');

  it('should set hearings collection from cache adding new ones', async () => {
    await pendingSubscriptionsFromCache.setPendingSubscriptions(newHearing, mockUser);
    sinon.assert.calledOnce(set);
  });

  it('should get hearings collection from cache', async () => {
    const cachedResult = await pendingSubscriptionsFromCache.getPendingSubscriptions(mockUser);
    expect(cachedResult).toStrictEqual(subscriptionsData);
  });

  it('should clear hearings collection from cache', async () => {
    const result = await pendingSubscriptionsFromCache.clearPendingSubscription(mockUser);
    expect(result).toBe(true);
  });

  it('should remove hearing collection from cache', async () => {
    const result = await pendingSubscriptionsFromCache.removeFromCache(2,mockUser);
    sinon.assert.called(set);
    expect(result).toBe(true);
  });
});

