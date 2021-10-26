import { SubscriptionService } from '../../../main/service/subscriptionService';

const subscriptionService = new SubscriptionService();

describe('generate rows functions without subscriptions', () => {

  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = subscriptionService.generateCaseTableRows(2);
    expect(caseSubscriptionRows.length).toBe(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = subscriptionService.generateCourtTableRows(2);
    expect(courtSubscriptionRows.length).toBe(0);
  });
});

describe('generate rows functions with subscriptions', () => {
  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = subscriptionService.generateCaseTableRows(1);
    expect(caseSubscriptionRows.length).toBeGreaterThan(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = subscriptionService.generateCourtTableRows(1);
    expect(courtSubscriptionRows.length).toBeGreaterThan(0);
  });
});
