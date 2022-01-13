import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { subscriptionManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { Subscription } from '../../../main/models/subscription';

const userIdWithSubscriptions = 1;
const userIdWithoutSubscriptions = 2;
const nonExistingUserId = 777;
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

const rawData = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const stub = sinon.stub(subscriptionManagementApi, 'get');
const subscriptionManagementStub = sinon.stub(subscriptionManagementApi, 'post');

describe(`getUserSubscriptions(${userIdWithSubscriptions}) with valid user id`, () => {
  stub.withArgs(`/subscription/user/${userIdWithSubscriptions}`).resolves(subscriptionsData);

  it('should return user subscription object', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions) as Subscription[];
    expect(userSubscriptions.length).toEqual(2);
    const subscription = userSubscriptions[0];
    expect(subscription.id).toEqual('625d98a9-eec2-422d-83a8-8eb1a704c60d');
    expect(subscription.channel).toEqual('API');
    expect(subscription.searchType).toEqual('CASE_URN');
    expect(subscription.searchValue).toEqual('N3D8DLZCNP');
    expect(subscription.userId).toEqual('1');
    expect(subscription.createdDate).toEqual('2021-12-23T11:32:54.80786');
    expect(subscription.caseSubscriptions.length).toEqual(1);
    expect(subscription.courtSubscriptions.length).toEqual(0);

  });

  it('should have mocked object in the case subscriptions list', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions);
    const subscription = userSubscriptions[0];

    expect(subscription.caseSubscriptions[0].caseNumber).toBe(mockedCaseSubscription.reference);
  });

  it('should have mocked object in the court subscriptions list', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions);
    const subscription = userSubscriptions[1];

    expect(subscription.courtSubscriptions[0].name).toBe(mockedCourtSubscription.name);
  });
});

describe('getUserSubscriptions error tests', () => {
  beforeEach(() => {
    stub.withArgs(`/subscription/user/${userIdWithoutSubscriptions}`).resolves({'data': []});
    stub.withArgs(`/subscription/user/${nonExistingUserId}`).resolves({'data': []});
    stub.withArgs('/subscription/user/99').resolves(Promise.reject(errorRequest));
    stub.withArgs('/subscription/user/999').resolves(Promise.reject(errorMessage));
  });

  it('should return user subscription object', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithoutSubscriptions);
    expect(userSubscriptions.length).toBe(0);
  });

  it('should return null for error response', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(99);
    expect(userSubscriptions).toBe(null);
  });

  it('should return empty list of subscriptions', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(nonExistingUserId);
    expect(userSubscriptions.length).toBe(0);
  });

  it('should return null for error message', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(999);
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

