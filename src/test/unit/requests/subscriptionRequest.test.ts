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
const errorMessage = {
  message: 'test',
};
const errorRequest = {
  request: 'test error',
};

const unsubscribeValidData = {
  subscriptionId: '123',
};
const unsubscribeInvalidData = {
  subscriptionId: 'foo',
};
const errorBodyData = {baz: 'qux'};
const errorRequestBodyData = {foo: 'bar'};

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const stub = sinon.stub(dataManagementApi, 'get');
const subscriptionManagementStub = sinon.stub(subscriptionManagementApi, 'post');
const deleteStub = sinon.stub(subscriptionManagementApi, 'delete');

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
  stub.withArgs('/hearings/urn/123456').resolves(Promise.reject(errorResponse));
  it('should return null list of subscriptions', async () => {
    const userSubscriptions = await subscriptionActions.getSubscriptionByUrn('123456');
    expect(userSubscriptions).toBe(null);
  });
});

describe('non existing subscriptions getSubscriptionByUrn error response', () => {
  stub.withArgs('/hearings/urn/1234567').resolves(Promise.reject({error: {message: 'failure'}}));
  it('should return null list of subscriptions', async () => {
    const userSubscriptions = await subscriptionActions.getSubscriptionByUrn('1234567');
    expect(userSubscriptions).toBe(null);
  });
});

describe('subscribe', () => {
  it('should return true if call is successful', async() => {
    subscriptionManagementStub.withArgs('/subscription').resolves({});
    const userSubscriptions = await subscriptionActions.subscribe({});
    expect(userSubscriptions).toBe(true);
  });

  it('should return false for failure', async() => {
    subscriptionManagementStub.withArgs('/subscription').resolves(Promise.reject(errorMessage));
    const userSubscriptions = await subscriptionActions.subscribe({});
    expect(userSubscriptions).toBe(false);
  });

  it('should return false for error request', async() => {
    subscriptionManagementStub.withArgs('/subscription').resolves(Promise.reject(errorRequest));
    const userSubscriptions = await subscriptionActions.subscribe({});
    expect(userSubscriptions).toBe(false);
  });

  it('should return false for error response', async() => {
    subscriptionManagementStub.withArgs('/subscription').resolves(Promise.reject(errorResponse));
    const userSubscriptions = await subscriptionActions.subscribe({});
    expect(userSubscriptions).toBe(false);
  });
});

describe('unsubscribe with valid post data', () => {
  deleteStub.withArgs('/subscription/123').resolves({data: 'unsubscribed successfully'});
  it('should return true if provided data is valid', async () => {
    const unsubscribe = await subscriptionActions.unsubscribe(unsubscribeValidData.subscriptionId);
    expect(unsubscribe).toBe('unsubscribed successfully');
  });
});

describe('unsubscribe error states', () => {
  describe('unsubscribe error response', () => {
    deleteStub.withArgs(`/subscription/${unsubscribeInvalidData.subscriptionId}`).resolves(Promise.reject(errorResponse));
    it('should return null', async () => {
      const unsubscribe = await subscriptionActions.unsubscribe(unsubscribeInvalidData.subscriptionId);
      expect(unsubscribe).toBe(null);
    });
  });

  describe('unsubscribe error request', () => {
    deleteStub.withArgs(`/subscription/${errorRequestBodyData.foo}`).resolves(Promise.reject(errorRequest));
    it('should return null', async () => {
      const unsubscribe = await subscriptionActions.unsubscribe(errorRequestBodyData.foo);
      expect(unsubscribe).toBe(null);
    });
  });

  describe('unsubscribe error', () => {
    deleteStub.withArgs(`/subscription/${errorBodyData.baz}`).resolves(Promise.reject({error: 'error'}));
    it('should return null', async () => {
      const unsubscribe = await subscriptionActions.unsubscribe(errorBodyData.baz);
      expect(unsubscribe).toBe(null);
    });
  });
});

