import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';

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
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
sinon.stub(SubscriptionRequests.prototype, 'getSubscriptionByUrn').returns(subscriptionsData);

describe('Subscription request', () => {

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

  describe(`getSubscriptionByUrn(${validUrn}) with valid urn`, async () => {
    const subscriptions = await subscriptionActions.getSubscriptionByUrn(validUrn);
    it('should return hearing matching the urn', () => {
      expect(subscriptions.urn === validUrn).toBeTruthy();
    });
  });

  describe(`non existing subscriptions getSubscriptionByUrn(${invalidUrn})`, () => {
    sinon.restore();
    sinon.stub(SubscriptionRequests.prototype, 'getSubscriptionByUrn').returns(null);
    const userSubscriptions = subscriptionActions.getSubscriptionByUrn(invalidUrn);
    it('should return null', () => {
      expect(userSubscriptions).toBe(null);
    });
  });
});
