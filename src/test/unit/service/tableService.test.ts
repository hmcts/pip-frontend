import { TableService } from '../../../main/service/tableService';
import { SubscriptionActions } from '../../../main/resources/actions/subscriptionActions';

const tableService = new TableService();
const subscriptionsData = new SubscriptionActions().getUserSubscriptions(1);
const noSubscriptionsData = new SubscriptionActions().getUserSubscriptions(2);

describe('generate rows functions without subscriptions', () => {

  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = tableService.generateCaseTableRows(noSubscriptionsData);
    expect(caseSubscriptionRows.length).toBe(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = tableService.generateCourtTableRows(noSubscriptionsData);
    expect(courtSubscriptionRows.length).toBe(0);
  });
});

describe('generate rows functions with subscriptions', () => {
  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = tableService.generateCaseTableRows(subscriptionsData);
    expect(caseSubscriptionRows.length).toBeGreaterThan(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = tableService.generateCourtTableRows(subscriptionsData);
    expect(courtSubscriptionRows.length).toBeGreaterThan(0);
  });
});
