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
const errorRequest = {
  request: 'test error',
};
const errorMessage = {
  message: 'test',
};

const rawData2 = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionsData2 = JSON.parse(rawData2);
const stub = sinon.stub(subscriptionManagementApi, 'get');

describe(`getUserSubscriptions(${userIdWithSubscriptions}) with valid user id`, () => {
  stub.withArgs(`/subscription/user/${userIdWithSubscriptions}`).resolves(subscriptionsData2.results[0]);

  it('should return user subscription object', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions) as Subscription;
    expect(userSubscriptions.courtSubscriptions.length).toBeGreaterThan(0);
    expect(userSubscriptions.caseSubscriptions.length).toBeGreaterThan(0);
  });

  it('should have mocked object in the case subscriptions list', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions);
    expect(userSubscriptions.caseSubscriptions.filter((subscription) =>
      subscription.reference === mockedCaseSubscription.reference).length).toBe(1);
  });

  it('should have mocked object in the court subscriptions list', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions);
    expect(userSubscriptions.courtSubscriptions.filter((subscription) =>
      subscription.name === mockedCourtSubscription.name).length).toBe(1);
  });
});

describe('getUserSubscriptions error tests', () => {
  beforeEach(() => {
    stub.withArgs(`/subscription/user/${userIdWithoutSubscriptions}`).resolves(subscriptionsData2.results[1]);
    stub.withArgs(`/subscription/user/${nonExistingUserId}`).resolves({ data: null });
    stub.withArgs('/subscription/user/99').resolves(Promise.reject(errorRequest));
    stub.withArgs(`/subscription/user/${nonExistingUserId}`).resolves(Promise.reject(errorResponse));
    stub.withArgs('/subscription/user/999').resolves(Promise.reject(errorMessage));
  });

  it('should return user subscription object', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithoutSubscriptions);
    expect(userSubscriptions.courtSubscriptions.length).toBe(0);
    expect(userSubscriptions.caseSubscriptions.length).toBe(0);
  });

  it('should return null for error response', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(99);
    expect(userSubscriptions).toBe(null);
  });

  it('should return null list of subscriptions', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(nonExistingUserId);
    expect(userSubscriptions).toBe(null);
  });

  it('should return null list of subscriptions', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(nonExistingUserId);
    expect(userSubscriptions).toBe(null);
  });

  it('should return null for error message', async () => {
    const userSubscriptions = await subscriptionActions.getUserSubscriptions(999);
    expect(userSubscriptions).toBe(null);
  });
});
