import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';
import {SubscriptionService} from '../../../main/service/subscriptionService';

const userIdWithSubscriptions = 1;
const userIdWithoutSubscriptions = 2;
const nonExistingUserId = 777;
const mockUser = {
  id : '1'
};
const validUrn = '123456789';
const invalidUrn = '1234';

const subscriptionActions = new SubscriptionRequests();
const subscriptionService = new SubscriptionService();
const mockedCaseSubscription = {
  name: 'Wyman Inc Dispute',
  reference: 'T20217010',
  dateAdded: '1632351600',
};
const mockedCourtSubscription = {
  name: 'Mutsu Court',
  dateAdded: '1632351600',
};

const errorResponse = {
  response: {
    data: 'test error',
  },
};

const errorRequest = {
  request: 'test error',
};

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const stub = sinon.stub(dataManagementApi, 'get');

describe(`getUserSubscriptions(${userIdWithSubscriptions}) with valid user id`, () => {
  const userSubscriptions = subscriptionActions.getUserSubscriptions(userIdWithSubscriptions);
  it('should return user subscription object', () => {
    expect(userSubscriptions.courtSubscriptions.length).toBeGreaterThan(0);
    expect(userSubscriptions.caseSubscriptions.length).toBeGreaterThan(0);
  });

  it('should have mocked object in the case subscriptions list', () => {
    expect(userSubscriptions.caseSubscriptions.filter((subscription) =>
      subscription.reference === mockedCaseSubscription.reference).length).toBe(1);
  });

  it('should have mocked object in the court subscriptions list', () => {
    expect(userSubscriptions.courtSubscriptions.filter((subscription) =>
      subscription.name === mockedCourtSubscription.name).length).toBe(1);
  });
});

describe(`getUserSubscriptions(${userIdWithoutSubscriptions}) with valid user id`, () => {
  const userSubscriptions = subscriptionActions.getUserSubscriptions(userIdWithoutSubscriptions);
  it('should return user subscription object', () => {
    expect(userSubscriptions.courtSubscriptions.length).toBe(0);
    expect(userSubscriptions.caseSubscriptions.length).toBe(0);
  });
});

describe(`non existing user Id getUserSubscriptions(${nonExistingUserId})`, () => {
  const userSubscriptions = subscriptionActions.getUserSubscriptions(nonExistingUserId);
  it('should return null', () => {
    expect(userSubscriptions).toBe(null);
  });
});

describe(`getSubscriptionByUrn(${validUrn}) with valid urn`, () => {
  stub.withArgs('/hearings/urn/123456789').resolves({data: subscriptionsData});
  it('should return hearing matching the urn', async () => {
    const sub = await subscriptionActions.getSubscriptionByUrn(validUrn);
    expect(sub.urn).toEqual(validUrn);
  });
});

describe(`non existing subscriptions getSubscriptionByUrn(${invalidUrn})`, () => {
  stub.withArgs(`/hearings/urn/${invalidUrn}`).resolves({data: null});

  it('should return null', async () => {
    const userSubscriptions = await subscriptionActions.getSubscriptionByUrn(invalidUrn);
    expect(userSubscriptions).toBe(null);
  });
});

describe('non existing subscriptions getSubscriptionByUrn error request', () => {
  stub.withArgs('/hearings/urn/12345').resolves(Promise.reject(errorRequest));
  it('should return null list of subscriptions', async () => {
    const userSubscriptions = await subscriptionActions.getSubscriptionByUrn('12345');
    expect(userSubscriptions).toBe(null);
  });
});

describe('non existing subscriptions getSubscriptionByUrn error response', () => {
  stub.withArgs('/hearings/urn/12345').resolves(Promise.reject(errorResponse));
  it('should return null list of subscriptions', async () => {
    const userSubscriptions = await subscriptionActions.getSubscriptionByUrn('12345');
    expect(userSubscriptions).toBe(null);
  });
});

describe('subscribe with valid user', async () => {
  const sub = await subscriptionService.getPendingSubscriptions(validUrn);
  const userSubscriptions = subscriptionActions.subscribe(sub, mockUser);
  it('should return user subscription object', () => {
    expect(userSubscriptions).toBe(sub);
  });
});

describe('subscribe with null user', async () => {
  const sub = await subscriptionService.getPendingSubscriptions(validUrn);
  const userSubscriptions = subscriptionActions.subscribe(sub, null);
  it('should return user subscription object', () => {
    expect(userSubscriptions).toBe(null);
  });
});
