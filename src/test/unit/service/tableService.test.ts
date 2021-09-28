import { TableService } from '../../../main/service/tableService';

const tableService = new TableService();
const userIdWithSubscriptions = 1;
const userIdWithoutSubscriptions = 2;

describe('generate rows functions without subscriptions', () => {

  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = tableService.generateCaseTableRows(userIdWithoutSubscriptions);
    expect(caseSubscriptionRows.length).toBe(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = tableService.generateCourtTableRows(userIdWithoutSubscriptions);
    expect(courtSubscriptionRows.length).toBe(0);
  });
});

describe('generate rows functions with subscriptions', () => {
  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = tableService.generateCaseTableRows(userIdWithSubscriptions);
    expect(caseSubscriptionRows.length).toBeGreaterThan(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = tableService.generateCourtTableRows(userIdWithSubscriptions);
    expect(courtSubscriptionRows.length).toBeGreaterThan(0);
  });
});
