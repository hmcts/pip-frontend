import { SubscriptionActions } from '../../../../main/resources/actions/subscriptionActions';


const userIdWithSubscriptions = 1;
const userIdWithoutSubscriptions = 2;
const subscriptionActions = new SubscriptionActions();
const mockedCaseSubscription = {
  name: 'Wyman Inc Dispute',
  reference: 'T20217010',
  dateAdded: '1632351600',
};
const mockedCourtSubscription = {
  name: 'Mutsu Court',
  dateAdded: '1632351600',
};

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

describe('generate rows functions without subscriptions', () => {
  subscriptionActions.userId = 2;
  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = subscriptionActions.generateCaseTableRows();
    expect(caseSubscriptionRows.length).toBe(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = subscriptionActions.generateCourtTableRows();
    expect(courtSubscriptionRows.length).toBe(0);
  });
});

describe('generate rows functions with subscriptions', () => {
  subscriptionActions.userId = 1;
  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = subscriptionActions.generateCaseTableRows();
    expect(caseSubscriptionRows.length).toBeGreaterThan(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = subscriptionActions.generateCourtTableRows();
    expect(courtSubscriptionRows.length).toBeGreaterThan(0);
  });
});
