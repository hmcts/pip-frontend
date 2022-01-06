import { SubscriptionService } from '../../../main/service/subscriptionService';
import { PendingSubscriptionsFromCache } from '../../../main/resources/requests/utils/pendingSubscriptionsFromCache';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { HearingService } from '../../../main/service/hearingService';
import { CourtService } from '../../../main/service/courtService';
import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';

const mockCourt = {
  courtId: 643,
  name: 'Aberdeen Tribunal Hearing Centre',
  jurisdiction: 'Tribunal',
  location: 'Scotland',
  hearingList: [],
  hearings: 0,
};
const mockCase = {
  hearingId: 5,
  courtId: 50,
  courtNumber: 1,
  date: '15/11/2021 10:00:00',
  judge: 'His Honour Judge A Morley QC',
  platform: 'In person',
  caseNumber: 'T485914',
  caseName: 'Ashely Barnes',
  urn: 'IBRANE1BVW',
};
const courtSubscriptionPayload = {
  channel: 'EMAIL',
  searchType: 'COURT_ID',
  searchValue: 643,
  userId: '1',
};
const caseSubscriptionPayload = {
  caseName: 'Ashely Barnes',
  caseNumber: 'T485914',
  channel: 'EMAIL',
  searchType: 'CASE_ID',
  searchValue: 'T485914',
  urn: 'IBRANE1BVW',
  userId: '1',
};
const blankPayload = {
  channel: 'EMAIL',
  searchType: '',
  searchValue: '',
  userId: '5',
};
const userIdWithSubscriptions = '1';
const userIdWithoutSubscriptions = '2';
const subscriptionService = new SubscriptionService();
const pendingSubscriptionsFromCache = new PendingSubscriptionsFromCache();
const stubSubscriptionSearchUrn = sinon.stub(subscriptionService, 'getSubscriptionUrnDetails');
const cacheSetStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'setPendingSubscriptions');
const cacheGetStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
const removeStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'removeFromCache');
const hearingStub = sinon.stub(HearingService.prototype, 'getCaseByNumber');
const courtStub = sinon.stub(CourtService.prototype, 'getCourtById');
const subscriptionStub = sinon.stub(SubscriptionRequests.prototype, 'subscribe');
subscriptionStub.withArgs(caseSubscriptionPayload, 'cases', '1').resolves(true);
subscriptionStub.withArgs(caseSubscriptionPayload, 'courts', '1').resolves(true);
subscriptionStub.withArgs(blankPayload, 'courts', '1').resolves(false);
subscriptionStub.withArgs(blankPayload, 'cases', '1').resolves(false);
courtStub.withArgs('643').resolves(mockCourt);
courtStub.withArgs('111').resolves(mockCourt);
courtStub.withArgs('').resolves(null);
hearingStub.withArgs('T485914').resolves(mockCase);
hearingStub.withArgs('T485912').resolves(mockCase);
hearingStub.withArgs('').resolves(null);
cacheSetStub.withArgs([], 'cases', userIdWithSubscriptions).resolves();
cacheSetStub.withArgs([], 'courts', userIdWithSubscriptions).resolves();
cacheSetStub.withArgs([mockCourt], 'courts', userIdWithSubscriptions).resolves();
cacheSetStub.withArgs([mockCase], 'cases', userIdWithSubscriptions).resolves();
cacheGetStub.withArgs(userIdWithSubscriptions, 'cases').resolves([mockCase]);
cacheGetStub.withArgs(userIdWithSubscriptions, 'courts').resolves([mockCourt]);
cacheGetStub.withArgs(userIdWithoutSubscriptions, 'cases').resolves([]);
cacheGetStub.withArgs(userIdWithoutSubscriptions, 'courts').resolves([]);
removeStub.withArgs({case: '888'}, userIdWithSubscriptions).resolves();
removeStub.withArgs({court: '111'}, userIdWithSubscriptions).resolves();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionResult = JSON.parse(rawData);
const validUrn = '123456789';
stubSubscriptionSearchUrn.withArgs(validUrn).returns(subscriptionResult);

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

  it('getSubscriptionUrnDetails should return the cases', () => {
    const courtSubscription= subscriptionService.getSubscriptionUrnDetails(validUrn);
    expect(courtSubscription).not.toBeNull();
  });
});

describe('handleNewSubscription function', () => {
  it('should add new case subscription', async () => {
    const pendingSubscription = {'hearing-selections[]': 'T485914'};
    await subscriptionService.handleNewSubscription(pendingSubscription, '1');
  });

  it('should add new case subscriptions', async () => {
    const pendingSubscription = {'hearing-selections[]': ['T485914', 'T485912']};
    await subscriptionService.handleNewSubscription(pendingSubscription, '1');
  });

  it('should add new court subscription', async () => {
    const pendingSubscription = {'court-selections[]': '643'};
    await subscriptionService.handleNewSubscription(pendingSubscription, '1');
  });

  it('should add new court subscriptions', async () => {
    const pendingSubscription = {'court-selections[]': ['643', '111']};
    await subscriptionService.handleNewSubscription(pendingSubscription, '1');
  });

  it('should not do anything for blank data provided', async () => {
    await subscriptionService.handleNewSubscription({}, '3');
  });
});

describe('getCaseDetails function', () => {
  it('should return case details list', async () => {
    const caseDetailsList = await subscriptionService.getCaseDetails(['T485914']);
    expect(caseDetailsList).toStrictEqual([mockCase]);
  });

  it('should return empty case list if invalid case number is provided', async () => {
    const caseList = await subscriptionService.getCaseDetails(['']);
    expect(caseList).toEqual([]);
  });

  it('should return empty case list if no cases are provided', async () => {
    const caseList = await subscriptionService.getCaseDetails([]);
    expect(caseList).toEqual([]);
  });
});

describe('getCourtDetails function', () => {
  it('should return court details list', async () => {
    const courtDetailsList = await subscriptionService.getCourtDetails(['643']);
    expect(courtDetailsList).toStrictEqual([mockCourt]);
  });

  it('should return empty court list if invalid courtId is provided', async () => {
    const courtList = await subscriptionService.getCourtDetails(['']);
    expect(courtList).toEqual([]);
  });

  it('should return empty court list if no courts are provided', async () => {
    const courtList = await subscriptionService.getCourtDetails([]);
    expect(courtList).toEqual([]);
  });
});

describe('setPendingSubscriptions function', () => {
  it('should call cases cache set without cases provided', async () => {
    await pendingSubscriptionsFromCache.setPendingSubscriptions([], 'cases', userIdWithSubscriptions);
    sinon.assert.called(cacheSetStub);
  });

  it('should call cases cache set with cases', async () => {
    await pendingSubscriptionsFromCache.setPendingSubscriptions([mockCase], 'cases', userIdWithSubscriptions);
    sinon.assert.called(cacheSetStub);
  });

  it('should call courts cache set without courts provided', async () => {
    await pendingSubscriptionsFromCache.setPendingSubscriptions([], 'courts', userIdWithSubscriptions);
    sinon.assert.called(cacheSetStub);
  });

  it('should call courts cache set with courts', async () => {
    await pendingSubscriptionsFromCache.setPendingSubscriptions([mockCourt], 'courts', userIdWithSubscriptions);
    sinon.assert.called(cacheSetStub);
  });
});

describe('getPendingSubscriptions function', () => {
  it('should return list of cached courts', async () => {
    const cachedCourts = await pendingSubscriptionsFromCache.getPendingSubscriptions(userIdWithSubscriptions, 'courts');
    expect(cachedCourts).toStrictEqual([mockCourt]);
  });

  it('should return list of cached cases', async () => {
    const cachedCases = await pendingSubscriptionsFromCache.getPendingSubscriptions(userIdWithSubscriptions, 'cases');
    expect(cachedCases).toStrictEqual([mockCase]);
  });

  it('should return empty list of courts from the cache', async () => {
    const cachedCourts  = await pendingSubscriptionsFromCache.getPendingSubscriptions(userIdWithoutSubscriptions, 'courts');
    expect(cachedCourts).toEqual([]);
  });

  it('should return empty list of cases from the cache', async () => {
    const cachedCases = await pendingSubscriptionsFromCache.getPendingSubscriptions(userIdWithoutSubscriptions, 'cases');
    expect(cachedCases).toEqual([]);
  });
});

describe('subscribe function', () => {
  it('should return true for successful subscription', async () => {
    const subscriptionRes = await subscriptionService.subscribe(userIdWithoutSubscriptions);
    expect(subscriptionRes).toBe(true);
  });
});

describe('removeFromCache function', () => {
  it('should call a function to remove a case from the cache', async () => {
    await pendingSubscriptionsFromCache.removeFromCache({case: '888'}, userIdWithSubscriptions);
    sinon.assert.called(removeStub);
  });

  it('should call a function to remove a court from the cache', async () => {
    await pendingSubscriptionsFromCache.removeFromCache({court: '111'}, userIdWithSubscriptions);
    sinon.assert.called(removeStub);
  });
});

describe('createSubscriptionPayload function', () => {
  it('should create court subscription payload', async () => {
    const payload = subscriptionService.createSubscriptionPayload(mockCourt, 'courts', '1');
    expect(payload).toStrictEqual(courtSubscriptionPayload);
  });

  it('should create case subscription payload', async () => {
    const payload = subscriptionService.createSubscriptionPayload(mockCase, 'cases', '1');
    expect(payload).toStrictEqual(caseSubscriptionPayload);
  });

  it('should create blank payload', async () => {
    const payload = subscriptionService.createSubscriptionPayload({}, 'foo', '5');
    expect(payload).toStrictEqual(blankPayload);
  });
});
