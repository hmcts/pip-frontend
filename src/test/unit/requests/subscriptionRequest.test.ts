import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { subscriptionManagementApi } from '../../../main/resources/requests/utils/axiosConfig';

const userIdWithSubscriptions = 1;
const userIdWithoutSubscriptions = 2;
const nonExistingUserId = 777;
const subscriptionActions = new SubscriptionRequests();
const mockedCaseSubscription = {
  name: 'Wyman Inc Dispute',
  reference: 'T485913',
};
const mockedCourtSubscription = {
  name: 'Court 1',
  dateAdded: '2022-01-14T11:42:57.847708',
};

const errorResponse = {
  response: {
    data: 'test error',
  },
};
const errorRequest = {
  request: 'test error',
};
const errorMessage = {
  message: 'test',
};

const unsubscribeValidData = {
  subscriptionId: '123',
};
const unsubscribeInvalidData = {
  subscriptionId: 'foo',
};
const errorBodyData = {baz: 'qux'};
const errorRequestBodyData = {foo: 'bar'};
const rawData2 = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionsData2 = JSON.parse(rawData2);
const stub = sinon.stub(subscriptionManagementApi, 'get');
const subscriptionManagementStub = sinon.stub(subscriptionManagementApi, 'post');
const deleteStub = sinon.stub(subscriptionManagementApi, 'delete');

describe(`getUserSubscriptions(${userIdWithSubscriptions}) with valid user id`, () => {
  stub.withArgs(`/subscription/user/${userIdWithSubscriptions}`).resolves(subscriptionsData2);

  it('should return user subscription object', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions);
    expect(userSubscriptions.caseSubscriptions.length).toEqual(2);
    expect(userSubscriptions.courtSubscriptions.length).toEqual(3);
  });

  it('should have mocked object in the case subscriptions list', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions);
    expect(userSubscriptions.caseSubscriptions[0].caseNumber).toBe(mockedCaseSubscription.reference);
  });

  it('should have mocked object in the court subscriptions list', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions);
    expect(userSubscriptions.courtSubscriptions[0].courtName).toBe(mockedCourtSubscription.name);
  });
});

describe('getUserSubscriptions error tests', () => {
  beforeEach(() => {
    stub.withArgs(`/subscription/user/${userIdWithoutSubscriptions}`).resolves({'data': []});
    stub.withArgs(`/subscription/user/${nonExistingUserId}`).resolves({'data': {caseSubscriptions: [], courtSubscriptions:[]}});
    stub.withArgs('/subscription/user/99').resolves(Promise.reject(errorRequest));
    stub.withArgs('/subscription/user/999').resolves(Promise.reject(errorMessage));
    stub.withArgs('/subscription/user/9999').resolves(Promise.reject(errorResponse));
  });

  it('should return null for error response', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(99);
    expect(userSubscriptions).toBe(null);
  });

  it('should return empty list of subscriptions', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(nonExistingUserId);
    expect(userSubscriptions.caseSubscriptions.length).toBe(0);
  });

  it('should return null for error message', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(999);
    expect(userSubscriptions).toBe(null);
  });

  it('should return null for error response', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(9999);
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

