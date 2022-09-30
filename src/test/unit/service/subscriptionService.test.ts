import { LocationService } from '../../../main/service/locationService';
import { PendingSubscriptionsFromCache } from '../../../main/resources/requests/utils/pendingSubscriptionsFromCache';
import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import { SubscriptionService } from '../../../main/service/subscriptionService';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {PublicationService} from '../../../main/service/publicationService';

const mockCourt = {
  locationId: 643,
  name: 'Aberdeen Tribunal Hearing Centre',
  welshName: 'Welsh court name test',
  jurisdiction: 'Tribunal',
  location: 'Scotland',
  listType: ['SJP_PUBLIC_LIST'],
};
const mockCase = {
  hearingId: 5,
  locationId: 50,
  courtNumber: 1,
  date: '15/11/2021 10:00:00',
  judge: 'His Honour Judge A Morley QC',
  platform: 'In person',
  caseNumber: 'T485914',
  caseName: 'Ashely Barnes',
  caseUrn: 'IBRANE1BVW',
  urnSearch: true,
};
const courtSubscriptionPayload = {
  channel: 'EMAIL',
  searchType: 'LOCATION_ID',
  searchValue: 643,
  locationName: 'Aberdeen Tribunal Hearing Centre',
  userId: '1',
  listType: ['SJP_PUBLIC_LIST'],
};
const courtSubscriptionWithSingleListTypePayload =
  ['CIVIL_DAILY_CAUSE_LIST'];
const courtSubscriptionWithMultipleListTypePayload =
  ['CIVIL_DAILY_CAUSE_LIST','FAMILY_DAILY_CAUSE_LIST'];
const courtSubscriptionWithEmptyListTypePayload = [];

const caseSubscriptionPayload = {
  caseName: 'Ashely Barnes',
  caseNumber: 'T485914',
  channel: 'EMAIL',
  searchType: 'CASE_URN',
  searchValue: 'IBRANE1BVW',
  urn: 'IBRANE1BVW',
  userId: '1',
};
const blankPayload = {
  channel: 'EMAIL',
  searchType: '',
  searchValue: '',
  userId: '5',
};

const user = {};

const userIdWithSubscriptions = '1';
const userIdWithoutSubscriptions = '2';
const subscriptionService = new SubscriptionService();
const stubUserSubscription = sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions');
const rawData2 = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionResult2 = JSON.parse(rawData2);
stubUserSubscription.withArgs(userIdWithSubscriptions).returns(subscriptionResult2.data);
stubUserSubscription.withArgs(userIdWithoutSubscriptions).returns([]);
const pendingSubscriptionsFromCache = new PendingSubscriptionsFromCache();
const cacheSetStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'setPendingSubscriptions');
const cacheGetStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
const removeStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'removeFromCache');
const publicationStub = sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber');
sinon.stub(PublicationService.prototype, 'getCaseByCaseUrn').resolves(mockCase);
const locationStub = sinon.stub(LocationService.prototype, 'getLocationById');
const subscriptionStub = sinon.stub(SubscriptionRequests.prototype, 'subscribe');
const deleteStub = sinon.stub(SubscriptionRequests.prototype, 'unsubscribe');
const updateListTypeSubscriptionStub = sinon.stub(SubscriptionRequests.prototype, 'configureListTypeForLocationSubscriptions');
subscriptionStub.withArgs(caseSubscriptionPayload, 'cases', '1').resolves(true);
subscriptionStub.withArgs(caseSubscriptionPayload, 'courts', '1').resolves(true);
subscriptionStub.withArgs(blankPayload, 'courts', '1').resolves(false);
subscriptionStub.withArgs(blankPayload, 'cases', '1').resolves(false);

locationStub.withArgs('643').resolves(mockCourt);
locationStub.withArgs('111').resolves(mockCourt);
locationStub.withArgs('').resolves(null);
publicationStub.withArgs('T485914').resolves(mockCase);
publicationStub.withArgs('T485912').resolves(mockCase);
publicationStub.withArgs('').resolves(null);
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
deleteStub.withArgs('ValidSubscriptionId').resolves('Subscription was deleted');
deleteStub.withArgs('InValidSubscriptionId').resolves(null);
updateListTypeSubscriptionStub.withArgs('1', courtSubscriptionWithSingleListTypePayload).resolves(true);
updateListTypeSubscriptionStub.withArgs('1', courtSubscriptionWithMultipleListTypePayload).resolves(true);
updateListTypeSubscriptionStub.withArgs('1', courtSubscriptionWithEmptyListTypePayload).resolves(true);
updateListTypeSubscriptionStub.withArgs(null, courtSubscriptionWithEmptyListTypePayload).resolves(false);

describe('handleNewSubscription function', () => {
  it('should add new case subscription', async () => {
    const pendingSubscription = {'hearing-selections[]': 'T485914'};
    await subscriptionService.handleNewSubscription(pendingSubscription, '1');
  });

  it('should add new case subscriptions', async () => {
    const pendingSubscription = {'hearing-selections[]': ['T485914', 'T485912']};
    await subscriptionService.handleNewSubscription(pendingSubscription, '1');
  });

  it('should add new case subscription for urn search', async () => {
    const pendingSubscription = {urn: 'ValidURN'};
    await subscriptionService.handleNewSubscription(pendingSubscription, '99');
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
    const caseDetailsList = await subscriptionService.getCaseDetails(['T485914'], user);
    expect(caseDetailsList).toStrictEqual([mockCase]);
  });

  it('should return empty case list if invalid case number is provided', async () => {
    const caseList = await subscriptionService.getCaseDetails([''], user);
    expect(caseList).toEqual([]);
  });

  it('should return empty case list if no cases are provided', async () => {
    const caseList = await subscriptionService.getCaseDetails([], user);
    expect(caseList).toEqual([]);
  });
});

describe('getCourtDetails function', () => {
  it('should return court details list', async () => {
    const courtDetailsList = await subscriptionService.getCourtDetails(['643']);
    expect(courtDetailsList).toStrictEqual([mockCourt]);
  });

  it('should return empty court list if invalid locationId is provided', async () => {
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
  it('should return true for successful subscription when no subscriptions', async () => {
    const subscriptionRes = await subscriptionService.subscribe(userIdWithoutSubscriptions);
    expect(subscriptionRes).toBe(true);
  });

  it('should return true for successful subscription when court and case subscriptions', async () => {
    subscriptionStub.withArgs(caseSubscriptionPayload).resolves(true);
    subscriptionStub.withArgs(courtSubscriptionPayload).resolves(true);

    const subscriptionRes = await subscriptionService.subscribe(userIdWithSubscriptions);
    expect(subscriptionRes).toBe(true);
  });

  it('should return true for successful subscription where no existing subs', async () => {
    cacheGetStub.withArgs('3', 'courts').resolves([mockCourt]);

    const courtWithoutExistingListType = {
      channel: 'EMAIL',
      searchType: 'LOCATION_ID',
      searchValue: 643,
      locationName: 'Aberdeen Tribunal Hearing Centre',
      userId: '1',
      listType: [],
    };

    subscriptionStub.withArgs(courtWithoutExistingListType).resolves(true);

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
    mockCase['urnSearch'] = true;
    const payload = subscriptionService.createSubscriptionPayload(mockCase, 'cases', '1');
    expect(payload).toStrictEqual(caseSubscriptionPayload);
  });

  it('should create blank payload', async () => {
    const payload = subscriptionService.createSubscriptionPayload({}, 'foo', '5');
    expect(payload).toStrictEqual(blankPayload);
  });
});

describe('configureListTypeForLocationSubscriptions', () => {
  it('should return a message if list type subscription is updated', async () => {
    const result = await subscriptionService.configureListTypeForLocationSubscriptions('1', 'CIVIL_DAILY_CAUSE_LIST');
    expect(result).toEqual(true);
  });

  it('should return a message if multiple list type subscription is updated', async () => {
    const listTypeArray = 'CIVIL_DAILY_CAUSE_LIST,FAMILY_DAILY_CAUSE_LIST'.split(',');
    const result = await subscriptionService.configureListTypeForLocationSubscriptions('1', listTypeArray);
    expect(result).toEqual(true);
  });

  it('should return a message if empty list type subscription is updated', async () => {
    const result = await subscriptionService.configureListTypeForLocationSubscriptions('1', null);
    expect(result).toEqual(true);
  });

  it('should return false if user id is not given', async () => {
    const result = await subscriptionService.configureListTypeForLocationSubscriptions(null, null);
    expect(result).toEqual(false);
  });
});

describe('unsubscribing', () => {
  it('should return a message if subscription is deleted', async () => {
    const payload = await subscriptionService.unsubscribe('ValidSubscriptionId');
    expect(payload).toEqual('Subscription was deleted');
  });

  it('should return null if subscription delete failed', async () => {
    const payload = await subscriptionService.unsubscribe('InValidSubscriptionId');
    expect(payload).toEqual(null);
  });
});

describe('generateListTypesForCourts', () => {

  const userId = 1234;
  const subscriptionData = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/listTypeSubscriptions/listTypeSubscriptions.json'), 'utf-8');
  const returnedSubscriptions = JSON.parse(subscriptionData);

  stubUserSubscription.withArgs(userId).returns(returnedSubscriptions.data);

  it('generate list types with no filters with no selected', async () => {
    locationStub.withArgs(1).resolves({jurisdiction: ['Civil']});

    const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', '', '');

    expect(result['listOptions']).toBeDefined();
    expect(result['filterOptions']).toBeDefined();

    const listOptions = result['listOptions'];
    expect(listOptions['C']).toBeDefined();

    const listTypes = listOptions['C'];
    expect(listTypes['CIVIL_AND_FAMILY_DAILY_CAUSE_LIST']).toBeDefined();
    expect(listTypes['CIVIL_DAILY_CAUSE_LIST']).toBeDefined();
    expect(listTypes['COP_DAILY_CAUSE_LIST']).toBeDefined();

    const civilAndFamilyCauseList = listTypes['CIVIL_AND_FAMILY_DAILY_CAUSE_LIST'];
    expect(civilAndFamilyCauseList['listFriendlyName']).toEqual('Civil and Family Daily Cause List');
    expect(civilAndFamilyCauseList['checked']).toBeTruthy();

    const civilDailyCauseList = listTypes['CIVIL_DAILY_CAUSE_LIST'];
    expect(civilDailyCauseList['checked']).toBeFalsy();

    const filterOptions = result['filterOptions'];
    expect(filterOptions['Jurisdiction']).toBeDefined();

    const jurisdictionFilter = filterOptions['Jurisdiction'];
    expect(jurisdictionFilter['Civil']).toBeDefined();
    expect(jurisdictionFilter['Family']).toBeDefined();

    const civilFilter = jurisdictionFilter['Civil'];
    expect(civilFilter['value']).toEqual('Civil');
    expect(civilFilter['text']).toEqual('Civil');
    expect(civilFilter['checked']).toBeFalsy();
  });

  it('generate list types with filters selected', async () => {
    locationStub.withArgs(1).resolves({jurisdiction: ['Civil']});

    const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', 'Family', '');

    expect(result['listOptions']).toBeDefined();
    expect(result['filterOptions']).toBeDefined();

    const listOptions = result['listOptions'];
    expect(listOptions['C']).toBeDefined();

    const listTypes = listOptions['C'];
    expect(listTypes['CIVIL_AND_FAMILY_DAILY_CAUSE_LIST']).toBeDefined();
    expect(listTypes['CIVIL_DAILY_CAUSE_LIST']).toBeDefined();
    expect(listTypes['COP_DAILY_CAUSE_LIST']).toBeDefined();

    const civilAndFamilyCauseList = listTypes['CIVIL_AND_FAMILY_DAILY_CAUSE_LIST'];
    expect(civilAndFamilyCauseList['listFriendlyName']).toEqual('Civil and Family Daily Cause List');
    expect(civilAndFamilyCauseList['checked']).toBeTruthy();
    expect(civilAndFamilyCauseList['hidden']).toBeFalsy();

    const civilDailyCauseList = listTypes['CIVIL_DAILY_CAUSE_LIST'];
    expect(civilDailyCauseList['checked']).toBeFalsy();
    expect(civilDailyCauseList['hidden']).toBeTruthy();

    const filterOptions = result['filterOptions'];
    expect(filterOptions['Jurisdiction']).toBeDefined();

    const jurisdictionFilter = filterOptions['Jurisdiction'];
    expect(jurisdictionFilter['Civil']).toBeDefined();
    expect(jurisdictionFilter['Family']).toBeDefined();

    const civilFilter = jurisdictionFilter['Civil'];
    expect(civilFilter['checked']).toBeFalsy();

    const familyFilter = jurisdictionFilter['Family'];
    expect(familyFilter['value']).toEqual('Family');
    expect(familyFilter['text']).toEqual('Family');
    expect(familyFilter['checked']).toBeTruthy();
  });

  it('generate list types with filters and clear', async () => {
    locationStub.withArgs(1).resolves({jurisdiction: ['Civil']});

    const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', 'Family', 'Family');

    expect(result['listOptions']).toBeDefined();
    expect(result['filterOptions']).toBeDefined();

    const listOptions = result['listOptions'];
    expect(listOptions['C']).toBeDefined();

    const listTypes = listOptions['C'];
    expect(listTypes['CIVIL_AND_FAMILY_DAILY_CAUSE_LIST']).toBeDefined();
    expect(listTypes['CIVIL_DAILY_CAUSE_LIST']).toBeDefined();
    expect(listTypes['COP_DAILY_CAUSE_LIST']).toBeDefined();

    const civilAndFamilyCauseList = listTypes['CIVIL_AND_FAMILY_DAILY_CAUSE_LIST'];
    expect(civilAndFamilyCauseList['listFriendlyName']).toEqual('Civil and Family Daily Cause List');
    expect(civilAndFamilyCauseList['checked']).toBeTruthy();
    expect(civilAndFamilyCauseList['hidden']).toBeFalsy();

    const civilDailyCauseList = listTypes['CIVIL_DAILY_CAUSE_LIST'];
    expect(civilDailyCauseList['checked']).toBeFalsy();
    expect(civilDailyCauseList['hidden']).toBeFalsy();

    const filterOptions = result['filterOptions'];
    expect(filterOptions['Jurisdiction']).toBeDefined();

    const jurisdictionFilter = filterOptions['Jurisdiction'];
    expect(jurisdictionFilter['Civil']).toBeDefined();
    expect(jurisdictionFilter['Family']).toBeDefined();

    const civilFilter = jurisdictionFilter['Civil'];
    expect(civilFilter['checked']).toBeFalsy();

    const familyFilter = jurisdictionFilter['Family'];
    expect(familyFilter['checked']).toBeFalsy();
  });

  it('should generate location table rows when language is English', async () => {
    const mockSubscriptionData = [{locationId: '643'}];
    const result = await subscriptionService.generateLocationTableRows(mockSubscriptionData, 'en',
      'subscription-management');

    expect(result[0][0].text).toEqual('Aberdeen Tribunal Hearing Centre');
    expect(result[0][2].html).toContain('Unsubscribe');
  });

  it('should generate location table rows when language is Welsh', async () => {
    const mockSubscriptionData = [{locationId: '643'}];
    const result = await subscriptionService.generateLocationTableRows(mockSubscriptionData, 'cy',
      'subscription-management');

    expect(result[0][0].text).toEqual('Welsh court name test');
    expect(result[0][2].html).toContain('dad-danysgrifio');
  });
});
