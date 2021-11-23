import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { dataManagementApi, subscriptionManagementApi } from '../../../main/resources/requests/utils/axiosConfig';

const userIdWithSubscriptions = 1;
const userIdWithoutSubscriptions = 2;
const nonExistingUserId = 777;

const validUrn = '123456789';
const invalidUrn = '1234';

const subscriptionActions = new SubscriptionRequests();
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

const unsubscribeValidData = {
  subscription: {name: 'real subscription'},
  userId: '1',
};

const unsubscribeInvalidData = {};
const errorBodyData = {baz: 'qux'};
const errorRequestBodyData = {foo: 'bar'};

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const stub = sinon.stub(dataManagementApi, 'get');
const postStub = sinon.stub(subscriptionManagementApi, 'post');

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

describe('unsubscribe with valid post data', () => {
  postStub.withArgs('/unsubscribe', unsubscribeValidData).resolves({data: 'unsubscribed successfully'});
  it('should return true if provided data is valid', async () => {
    const unsubscribe = await subscriptionActions.unsubscribe(unsubscribeValidData);
    expect(unsubscribe).toBe('unsubscribed successfully');
  });
});

describe('unsubscribe error response', () => {
  postStub.withArgs('/unsubscribe', unsubscribeInvalidData).resolves(Promise.reject(errorResponse));
  it('should return null', async () => {
    const unsubscribe = await subscriptionActions.unsubscribe(unsubscribeInvalidData);
    expect(unsubscribe).toBe(null);
  });
});

describe('unsubscribe error request', () => {
  postStub.withArgs('/unsubscribe', errorRequestBodyData).resolves(Promise.reject(errorRequest));
  it('should return null', async () => {
    const unsubscribe = await subscriptionActions.unsubscribe(errorRequestBodyData);
    expect(unsubscribe).toBe(null);
  });
});

describe('unsubscribe error', () => {
  postStub.withArgs('/unsubscribe', errorBodyData).resolves(Promise.reject({error: 'error'}));
  it('should return null', async () => {
    const unsubscribe = await subscriptionActions.unsubscribe(errorBodyData);
    expect(unsubscribe).toBe(null);
  });
});
