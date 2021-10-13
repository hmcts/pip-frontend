import { SubscriptionService } from '../../../main/service/subscriptionService';
import { SubscriptionActions } from '../../../main/resources/actions/subscriptionActions';

const subscriptionService = new SubscriptionService();
const subscriptionsData = new SubscriptionActions().getUserSubscriptions(1);
const noSubscriptionsData = new SubscriptionActions().getUserSubscriptions(2);

describe('generate rows functions without subscriptions', () => {

  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = subscriptionService.generateCaseTableRows(noSubscriptionsData);
    expect(caseSubscriptionRows.length).toBe(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = subscriptionService.generateCourtTableRows(noSubscriptionsData);
    expect(courtSubscriptionRows.length).toBe(0);
  });
});

describe('generate rows functions with subscriptions', () => {
  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = subscriptionService.generateCaseTableRows(subscriptionsData);
    expect(caseSubscriptionRows.length).toBeGreaterThan(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = subscriptionService.generateCourtTableRows(subscriptionsData);
    expect(courtSubscriptionRows.length).toBeGreaterThan(0);
  });
});
