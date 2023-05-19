import { LocationService } from '../../../main/service/locationService';
import { PendingSubscriptionsFromCache } from '../../../main/resources/requests/utils/pendingSubscriptionsFromCache';
import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import { SubscriptionService } from '../../../main/service/subscriptionService';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';

const userIdWithSubscriptions = '1';
const userIdWithoutSubscriptions = '2';

const mockCourt = {
    locationId: 1,
    name: 'Aberdeen Tribunal Hearing Centre',
    welshName: 'Welsh court name test',
    jurisdiction: 'Tribunal',
    location: 'Scotland',
    listType: ['SJP_PUBLIC_LIST'],
};
const mockCourt2 = {
    locationId: 2,
    name: 'Manchester Crown Court',
    welshName: 'Welsh court name test',
    jurisdiction: 'Tribunal',
    location: 'England',
    listType: ['SJP_PUBLIC_LIST'],
};
const mockCourt3 = {
    locationId: 3,
    name: "Barkingside Magistrates' Court",
    welshName: 'Welsh court name test',
    jurisdiction: 'Tribunal',
    location: 'England',
    listType: ['SJP_PUBLIC_LIST'],
};
const mockCase = {
    caseNumber: 'CASENUM1234',
    caseName: 'CASENAME1234',
    caseUrn: 'CASEURN1234',
    urnSearch: false,
};
const mockCaseWithUrnOnly = {
    caseNumber: null,
    caseName: null,
    caseUrn: 'CASEURN1234',
    urnSearch: true,
};
const courtSubscriptionPayload = {
    channel: 'EMAIL',
    searchType: 'LOCATION_ID',
    searchValue: 1,
    locationName: 'Aberdeen Tribunal Hearing Centre',
    userId: userIdWithSubscriptions,
    listType: ['SJP_PUBLIC_LIST'],
};
const courtSubscriptionWithSingleListTypePayload = ['CIVIL_DAILY_CAUSE_LIST'];
const courtSubscriptionWithMultipleListTypePayload = ['CIVIL_DAILY_CAUSE_LIST', 'FAMILY_DAILY_CAUSE_LIST'];
const courtSubscriptionWithEmptyListTypePayload = [];

const caseSubscriptionPayload = {
    caseName: 'CASENAME1234',
    caseNumber: 'CASENUM1234',
    channel: 'EMAIL',
    searchType: 'CASE_ID',
    searchValue: 'CASENUM1234',
    urn: 'CASEURN1234',
    userId: userIdWithSubscriptions,
};

const blankPayload = {
    channel: 'EMAIL',
    searchType: '',
    searchValue: '',
    userId: '5',
};

const user = {};
const requester = 'Test';

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
const getByCaseNumberStub = sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber');
const getCaseByUrnStub = sinon.stub(PublicationService.prototype, 'getCaseByCaseUrn');
const locationStub = sinon.stub(LocationService.prototype, 'getLocationById');
const subscriptionStub = sinon.stub(SubscriptionRequests.prototype, 'subscribe');
const updateListTypeSubscriptionStub = sinon.stub(
    SubscriptionRequests.prototype,
    'configureListTypeForLocationSubscriptions'
);
const deleteStubLocation = sinon.stub(SubscriptionRequests.prototype, 'deleteLocationSubscription');
subscriptionStub.withArgs(blankPayload, 'courts', userIdWithSubscriptions).resolves(false);
subscriptionStub.withArgs(blankPayload, 'cases', userIdWithSubscriptions).resolves(false);

removeStub.withArgs({ case: '888' }, userIdWithSubscriptions).resolves();
removeStub.withArgs({ court: '111' }, userIdWithSubscriptions).resolves();

locationStub.withArgs(1).resolves(mockCourt);
locationStub.withArgs(2).resolves(mockCourt2);
locationStub.withArgs(3).resolves(mockCourt3);
locationStub.withArgs('111').resolves(mockCourt);
locationStub.withArgs('').resolves(null);
getByCaseNumberStub.withArgs('T485914').resolves(mockCase);
getByCaseNumberStub.withArgs('T485912').resolves(mockCase);
getByCaseNumberStub.withArgs('').resolves(null);
getCaseByUrnStub.withArgs('URNCASE1234').resolves(mockCaseWithUrnOnly);
getCaseByUrnStub.withArgs('').resolves(null);

cacheSetStub.withArgs([], 'cases', userIdWithSubscriptions).resolves();
cacheSetStub.withArgs([], 'courts', userIdWithSubscriptions).resolves();
cacheSetStub.withArgs([mockCourt], 'courts', userIdWithSubscriptions).resolves();
cacheSetStub.withArgs([mockCase], 'cases', userIdWithSubscriptions).resolves();
cacheGetStub.withArgs(userIdWithSubscriptions, 'cases').resolves([mockCase]);
cacheGetStub.withArgs(userIdWithSubscriptions, 'courts').resolves([mockCourt]);
cacheGetStub.withArgs(userIdWithoutSubscriptions, 'cases').resolves([]);
cacheGetStub.withArgs(userIdWithoutSubscriptions, 'courts').resolves([]);

updateListTypeSubscriptionStub
    .withArgs(userIdWithSubscriptions, courtSubscriptionWithSingleListTypePayload)
    .resolves(true);
updateListTypeSubscriptionStub
    .withArgs(userIdWithSubscriptions, courtSubscriptionWithMultipleListTypePayload)
    .resolves(true);
updateListTypeSubscriptionStub
    .withArgs(userIdWithSubscriptions, courtSubscriptionWithEmptyListTypePayload)
    .resolves(true);
updateListTypeSubscriptionStub.withArgs(null, courtSubscriptionWithEmptyListTypePayload).resolves(false);
deleteStubLocation.withArgs(1, requester).returns('success');
deleteStubLocation.withArgs(2, requester).returns(null);

describe('getSubscriptionDataForView function', () => {
    locationStub.withArgs(1).resolves(mockCourt);

    describe('for Subscription Management page', () => {
        it("should return subscription data for 'all' tab", async () => {
            const result = await subscriptionService.getSubscriptionDataForView(userIdWithSubscriptions, 'en', 'all');
            const subscriptionData = JSON.parse(JSON.stringify(result));

            expect(subscriptionData.caseTableData).toHaveLength(6);
            const caseDataRow = subscriptionData.caseTableData[0];
            expect(caseDataRow).toHaveLength(4);
            expect(caseDataRow[3].html).toContain('Unsubscribe');

            expect(subscriptionData.locationTableData).toHaveLength(3);
            const locationDataRow = subscriptionData.locationTableData[0];
            expect(locationDataRow).toHaveLength(3);
            expect(locationDataRow[2].html).toContain('Unsubscribe');

            expect(subscriptionData.activeAllTab).toBeTruthy();
            expect(subscriptionData.activeCaseTab).toBeFalsy();
            expect(subscriptionData.activeLocationTab).toBeFalsy();
        });

        it("should return subscription data for 'case' tab", async () => {
            const result = await subscriptionService.getSubscriptionDataForView(userIdWithSubscriptions, 'en', 'case');
            const subscriptionData = JSON.parse(JSON.stringify(result));

            expect(subscriptionData.caseTableData).toHaveLength(6);
            const caseDataRow = subscriptionData.caseTableData[0];
            expect(caseDataRow).toHaveLength(4);
            expect(caseDataRow[3].html).toContain('Unsubscribe');

            expect(subscriptionData.locationTableData).toHaveLength(3);
            const locationDataRow = subscriptionData.locationTableData[0];
            expect(locationDataRow).toHaveLength(3);
            expect(locationDataRow[2].html).toContain('Unsubscribe');

            expect(subscriptionData.activeAllTab).toBeFalsy();
            expect(subscriptionData.activeCaseTab).toBeTruthy();
            expect(subscriptionData.activeLocationTab).toBeFalsy();
        });

        it("should return subscription data for 'location' tab", async () => {
            const result = await subscriptionService.getSubscriptionDataForView(
                userIdWithSubscriptions,
                'en',
                'location'
            );
            const subscriptionData = JSON.parse(JSON.stringify(result));

            expect(subscriptionData.caseTableData).toHaveLength(6);
            const caseDataRow = subscriptionData.caseTableData[0];
            expect(caseDataRow).toHaveLength(4);
            expect(caseDataRow[3].html).toContain('Unsubscribe');

            expect(subscriptionData.locationTableData).toHaveLength(3);
            const locationDataRow = subscriptionData.locationTableData[0];
            expect(locationDataRow).toHaveLength(3);
            expect(locationDataRow[2].html).toContain('Unsubscribe');

            expect(subscriptionData.activeAllTab).toBeFalsy();
            expect(subscriptionData.activeCaseTab).toBeFalsy();
            expect(subscriptionData.activeLocationTab).toBeTruthy();
        });

        it('should sort case subscription data by case name and case reference', async () => {
            const result = await subscriptionService.getSubscriptionDataForView(userIdWithSubscriptions, 'en', 'case');
            const subscriptionData = JSON.parse(JSON.stringify(result));
            const firstRow = subscriptionData.caseTableData[0];
            expect(firstRow[0].text).toEqual('Test Name');
            expect(firstRow[1].text).toEqual('C123123');

            const secondRow = subscriptionData.caseTableData[1];
            expect(secondRow[0].text).toEqual('Test Name 2');
            expect(secondRow[1].text).toEqual('I123123');

            const thirdRow = subscriptionData.caseTableData[2];
            expect(thirdRow[0].text).toEqual('Test Name 3');
            expect(thirdRow[1].text).toEqual('1212121212');

            const fourthRow = subscriptionData.caseTableData[3];
            expect(fourthRow[0].text).toEqual('Test Name 3');
            expect(fourthRow[1].text).toEqual('B123123');

            const fifthRow = subscriptionData.caseTableData[4];
            expect(fifthRow[0].text).toBeNull();
            expect(fifthRow[1].text).toEqual('A123123');

            const sixthRow = subscriptionData.caseTableData[5];
            expect(sixthRow[0].text).toBeNull();
            expect(sixthRow[1].text).toEqual('D123123');
        });

        it('should sort location subscription data by court name', async () => {
            const result = await subscriptionService.getSubscriptionDataForView(
                userIdWithSubscriptions,
                'en',
                'location'
            );
            const subscriptionData = JSON.parse(JSON.stringify(result));

            expect(subscriptionData.locationTableData[0][0].text).toEqual('Aberdeen Tribunal Hearing Centre');
            expect(subscriptionData.locationTableData[1][0].text).toEqual("Barkingside Magistrates' Court");
            expect(subscriptionData.locationTableData[2][0].text).toEqual('Manchester Crown Court');
        });

        it('should sort location when duplicate location subscription is set', async () => {
            const locationDuplicateSubscription = fs.readFileSync(
                path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptionsLocationDuplicate.json'),
                'utf-8'
            );
            stubUserSubscription.withArgs('12341234').resolves(JSON.parse(locationDuplicateSubscription).data);

            const result = await subscriptionService.getSubscriptionDataForView('12341234', 'en', 'location');
            const subscriptionData = JSON.parse(JSON.stringify(result));
            expect(subscriptionData.locationTableData[0][0].text).toEqual('Manchester Crown Court');
            expect(subscriptionData.locationTableData[1][0].text).toEqual('Manchester Crown Court');
        });

        it('should sort case name when there are null in names and numbers/urns', async () => {
            const locationDuplicateSubscription = fs.readFileSync(
                path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptionsSingleCaseAndWithoutCaseName.json'),
                'utf-8'
            );
            stubUserSubscription.withArgs('1948291848').resolves(JSON.parse(locationDuplicateSubscription).data);

            const result = await subscriptionService.getSubscriptionDataForView('1948291848', 'en', 'case');
            const subscriptionData = JSON.parse(JSON.stringify(result));
            expect(subscriptionData.caseTableData[0][0].text).toBe('Case Name');
            expect(subscriptionData.caseTableData[0][1].text).toEqual('1234');
            expect(subscriptionData.caseTableData[1][0].text).toBe('Case Name');
            expect(subscriptionData.caseTableData[1][1].text).toEqual('1234512345');
            expect(subscriptionData.caseTableData[2][0].text).toBe('Case Name');
            expect(subscriptionData.caseTableData[2][1].text).toEqual('1234512345');
            expect(subscriptionData.caseTableData[3][0].text).toBe('Case Name');
            expect(subscriptionData.caseTableData[3][1].text).toBeNull();
            expect(subscriptionData.caseTableData[4][0].text).toBeNull();
            expect(subscriptionData.caseTableData[4][1].text).toBe('1234512346');
        });
    });

    describe('for Bulk Unsubscribe page', () => {
        it("should return subscription data for 'all' tab", async () => {
            const result = await subscriptionService.getSubscriptionDataForView(
                userIdWithSubscriptions,
                'en',
                'all',
                true
            );
            const subscriptionData = JSON.parse(JSON.stringify(result));

            expect(subscriptionData.caseTableData).toHaveLength(6);
            const caseDataRow = subscriptionData.caseTableData[0];
            expect(caseDataRow).toHaveLength(4);
            expect(caseDataRow[3].html).toContain('type="checkbox"');

            expect(subscriptionData.locationTableData).toHaveLength(3);
            const locationDataRow = subscriptionData.locationTableData[0];
            expect(locationDataRow).toHaveLength(3);
            expect(locationDataRow[2].html).toContain('type="checkbox"');

            expect(subscriptionData.activeAllTab).toBeTruthy();
            expect(subscriptionData.activeCaseTab).toBeFalsy();
            expect(subscriptionData.activeLocationTab).toBeFalsy();
        });

        it("should return subscription data for 'case' tab", async () => {
            const result = await subscriptionService.getSubscriptionDataForView(
                userIdWithSubscriptions,
                'en',
                'case',
                true
            );
            const subscriptionData = JSON.parse(JSON.stringify(result));

            expect(subscriptionData.caseTableData).toHaveLength(6);
            const caseDataRow = subscriptionData.caseTableData[0];
            expect(caseDataRow).toHaveLength(4);
            expect(caseDataRow[3].html).toContain('type="checkbox"');

            expect(subscriptionData.locationTableData).toHaveLength(3);
            const locationDataRow = subscriptionData.locationTableData[0];
            expect(locationDataRow).toHaveLength(3);
            expect(locationDataRow[2].html).toContain('type="checkbox"');

            expect(subscriptionData.activeAllTab).toBeFalsy();
            expect(subscriptionData.activeCaseTab).toBeTruthy();
            expect(subscriptionData.activeLocationTab).toBeFalsy();
        });

        it("should return subscription data for 'location' tab", async () => {
            const result = await subscriptionService.getSubscriptionDataForView(
                userIdWithSubscriptions,
                'en',
                'location',
                true
            );
            const subscriptionData = JSON.parse(JSON.stringify(result));

            expect(subscriptionData.caseTableData).toHaveLength(6);
            const caseDataRow = subscriptionData.caseTableData[0];
            expect(caseDataRow).toHaveLength(4);
            expect(caseDataRow[3].html).toContain('type="checkbox"');

            expect(subscriptionData.locationTableData).toHaveLength(3);
            const locationDataRow = subscriptionData.locationTableData[0];
            expect(locationDataRow).toHaveLength(3);
            expect(locationDataRow[2].html).toContain('type="checkbox"');

            expect(subscriptionData.activeAllTab).toBeFalsy();
            expect(subscriptionData.activeCaseTab).toBeFalsy();
            expect(subscriptionData.activeLocationTab).toBeTruthy();
        });

        it('should sort case subscription data by case name and case number', async () => {
            const result = await subscriptionService.getSubscriptionDataForView(userIdWithSubscriptions, 'en', 'case');
            const subscriptionData = JSON.parse(JSON.stringify(result));
            const firstRow = subscriptionData.caseTableData[0];
            expect(firstRow[0].text).toEqual('Test Name');
            expect(firstRow[1].text).toEqual('C123123');

            const secondRow = subscriptionData.caseTableData[1];
            expect(secondRow[0].text).toEqual('Test Name 2');
            expect(secondRow[1].text).toEqual('I123123');

            const thirdRow = subscriptionData.caseTableData[2];
            expect(thirdRow[0].text).toEqual('Test Name 3');
            expect(thirdRow[1].text).toEqual('1212121212');

            const fourthRow = subscriptionData.caseTableData[3];
            expect(fourthRow[0].text).toEqual('Test Name 3');
            expect(fourthRow[1].text).toEqual('B123123');

            const fifthRow = subscriptionData.caseTableData[4];
            expect(fifthRow[0].text).toBeNull();
            expect(fifthRow[1].text).toEqual('A123123');

            const sixthRow = subscriptionData.caseTableData[5];
            expect(sixthRow[0].text).toBeNull();
            expect(sixthRow[1].text).toEqual('D123123');
        });

        it('should sort location subscription data by court name', async () => {
            const result = await subscriptionService.getSubscriptionDataForView(
                userIdWithSubscriptions,
                'en',
                'location'
            );
            const subscriptionData = JSON.parse(JSON.stringify(result));

            expect(subscriptionData.locationTableData[0][0].text).toEqual('Aberdeen Tribunal Hearing Centre');
            expect(subscriptionData.locationTableData[1][0].text).toEqual("Barkingside Magistrates' Court");
            expect(subscriptionData.locationTableData[2][0].text).toEqual('Manchester Crown Court');
        });
    });
});

describe('handleNewSubscription function', () => {
    it('should add new case number subscription', async () => {
        const pendingSubscription = { 'case-number': 'T485914' };
        await subscriptionService.handleNewSubscription(pendingSubscription, user);

        sinon.assert.calledWith(cacheSetStub, [mockCase], 'cases', user['userId']);
    });

    it('should add new case number subscriptions', async () => {
        const pendingSubscription = {
            'case-number[]': ['T485914', 'T485912'],
        };
        await subscriptionService.handleNewSubscription(pendingSubscription, user);
        sinon.assert.calledWith(cacheSetStub, [mockCase, mockCase], 'cases', user['userId']);
    });

    it('should add new case urn subscription', async () => {
        const pendingSubscription = { urn: 'URNCASE1234' };
        await subscriptionService.handleNewSubscription(pendingSubscription, user);

        sinon.assert.calledWith(cacheSetStub, [mockCaseWithUrnOnly], 'cases', user['userId']);
    });

    it('should add new case urn subscriptions', async () => {
        const pendingSubscription = {
            'case-urn[]': ['URNCASE1234', 'URNCASE1234'],
        };
        await subscriptionService.handleNewSubscription(pendingSubscription, user);

        sinon.assert.calledWith(cacheSetStub, [mockCaseWithUrnOnly, mockCaseWithUrnOnly], 'cases', user['userId']);
    });

    it('should add new court subscription', async () => {
        const pendingSubscription = { 'court-selections[]': '643' };

        locationStub.withArgs('643').resolves(mockCourt);

        await subscriptionService.handleNewSubscription(pendingSubscription, user);

        sinon.assert.calledWith(cacheSetStub, [mockCourt], 'courts', user['userId']);
    });

    it('should add new court subscriptions', async () => {
        locationStub.withArgs('643').resolves(mockCourt);
        locationStub.withArgs('111').resolves(mockCourt);

        const pendingSubscription = { 'court-selections[]': ['643', '111'] };
        await subscriptionService.handleNewSubscription(pendingSubscription, user);

        sinon.assert.calledWith(cacheSetStub, [mockCourt, mockCourt], 'courts', user['userId']);
    });

    it('should not do anything for blank data provided', async () => {
        await subscriptionService.handleNewSubscription({}, { userID: 12345 });

        sinon.assert.neverCalledWith(cacheSetStub, sinon.match.any, sinon.match.any, '12345');
    });
});

describe('getCaseDetailsByNumber function', () => {
    it('should return case details list', async () => {
        const caseDetailsList = await subscriptionService.getCaseDetailsByNumber(['T485914'], user);
        expect(caseDetailsList).toStrictEqual([mockCase]);
    });

    it('should return empty case list if invalid case number is provided', async () => {
        const caseList = await subscriptionService.getCaseDetailsByNumber([''], user);
        expect(caseList).toEqual([]);
    });

    it('should return empty case list if no cases are provided', async () => {
        const caseList = await subscriptionService.getCaseDetailsByNumber([], user);
        expect(caseList).toEqual([]);
    });
});

describe('getCaseDetailsByUrn function', () => {
    it('should return case details list', async () => {
        const caseDetailsList = await subscriptionService.getCaseDetailsByUrn(['URNCASE1234'], user);
        expect(caseDetailsList).toStrictEqual([mockCaseWithUrnOnly]);
    });

    it('should return empty case list if invalid case number is provided', async () => {
        const caseList = await subscriptionService.getCaseDetailsByUrn([''], user);
        expect(caseList).toEqual([]);
    });

    it('should return empty case list if no cases are provided', async () => {
        const caseList = await subscriptionService.getCaseDetailsByUrn([], user);
        expect(caseList).toEqual([]);
    });
});

describe('getCourtDetails function', () => {
    it('should return court details list', async () => {
        const courtDetailsList = await subscriptionService.getCourtDetails([1]);
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
        const cachedCourts = await pendingSubscriptionsFromCache.getPendingSubscriptions(
            userIdWithSubscriptions,
            'courts'
        );
        expect(cachedCourts).toStrictEqual([mockCourt]);
    });

    it('should return list of cached cases', async () => {
        const cachedCases = await pendingSubscriptionsFromCache.getPendingSubscriptions(
            userIdWithSubscriptions,
            'cases'
        );
        expect(cachedCases).toStrictEqual([mockCase]);
    });

    it('should return empty list of courts from the cache', async () => {
        const cachedCourts = await pendingSubscriptionsFromCache.getPendingSubscriptions(
            userIdWithoutSubscriptions,
            'courts'
        );
        expect(cachedCourts).toEqual([]);
    });

    it('should return empty list of cases from the cache', async () => {
        const cachedCases = await pendingSubscriptionsFromCache.getPendingSubscriptions(
            userIdWithoutSubscriptions,
            'cases'
        );
        expect(cachedCases).toEqual([]);
    });
});

describe('subscribe function', () => {
    const userIdWithUrnSubscription = '3';
    const userIdWithCaseSubscription = '4';
    const userIdWithCourtSubscription = '5';

    const subscribeMockCourt = {
        locationId: 1,
        name: 'Aberdeen Tribunal Hearing Centre',
        welshName: 'Welsh court name test',
        jurisdiction: 'Tribunal',
        location: 'Scotland',
        listType: ['SJP_PUBLIC_LIST'],
    };

    const caseUrnSubscriptionPayload = {
        caseName: null,
        caseNumber: null,
        channel: 'EMAIL',
        searchType: 'CASE_URN',
        searchValue: 'CASEURN1234',
        urn: 'CASEURN1234',
        userId: userIdWithUrnSubscription,
    };

    cacheGetStub.withArgs(userIdWithUrnSubscription, 'cases').resolves([mockCaseWithUrnOnly]);
    cacheGetStub.withArgs(userIdWithUrnSubscription, 'courts').resolves([]);
    cacheGetStub.withArgs(userIdWithCaseSubscription, 'cases').resolves([mockCase]);
    cacheGetStub.withArgs(userIdWithCaseSubscription, 'courts').resolves([]);
    cacheGetStub.withArgs(userIdWithCourtSubscription, 'cases').resolves([]);
    cacheGetStub.withArgs(userIdWithCourtSubscription, 'courts').resolves([subscribeMockCourt]);
    subscriptionStub.withArgs(caseSubscriptionPayload, 'cases', userIdWithSubscriptions).resolves(true);
    subscriptionStub.withArgs(caseUrnSubscriptionPayload, 'cases', userIdWithUrnSubscription).resolves(true);
    subscriptionStub.withArgs(caseSubscriptionPayload, 'courts', userIdWithSubscriptions).resolves(true);

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

    it('should return true for successful subscription using case URN subscription', async () => {
        subscriptionStub.withArgs(caseUrnSubscriptionPayload).resolves(true);

        const subscriptionRes = await subscriptionService.subscribe(userIdWithSubscriptions);
        expect(subscriptionRes).toBe(true);
    });

    it('should return true for successful subscription where no existing subs - court subscription', async () => {
        const courtSubscription = {
            channel: 'EMAIL',
            searchType: 'LOCATION_ID',
            searchValue: subscribeMockCourt.locationId,
            locationName: subscribeMockCourt.name,
            listType: [],
            userId: userIdWithCourtSubscription,
        };

        subscriptionStub.withArgs(courtSubscription, userIdWithCourtSubscription).resolves(true);

        const subscriptionRes = await subscriptionService.subscribe(userIdWithCourtSubscription);
        expect(subscriptionRes).toBe(true);
    });

    it('should return true for successful subscription where no existing subs - case number subscription', async () => {
        const caseSubscription = {
            channel: 'EMAIL',
            searchType: 'CASE_ID',
            searchValue: mockCase.caseNumber,
            caseNumber: mockCase.caseNumber,
            caseName: mockCase.caseName,
            urn: mockCase.caseUrn,
            userId: userIdWithCaseSubscription,
        };

        subscriptionStub.withArgs(caseSubscription, userIdWithCaseSubscription).resolves(true);

        const subscriptionRes = await subscriptionService.subscribe(userIdWithCaseSubscription);

        sinon.assert.calledWith(removeStub, { 'case-number': mockCase.caseNumber }, userIdWithCaseSubscription);

        expect(subscriptionRes).toBe(true);
    });

    it('should return true for successful subscription where no existing subs - case urn subscription', async () => {
        const caseSubscription = {
            channel: 'EMAIL',
            searchType: 'CASE_URN',
            searchValue: mockCaseWithUrnOnly.caseUrn,
            caseNumber: mockCaseWithUrnOnly.caseNumber,
            caseName: mockCaseWithUrnOnly.caseName,
            urn: mockCaseWithUrnOnly.caseUrn,
            userId: userIdWithUrnSubscription,
        };

        subscriptionStub.withArgs(caseSubscription, userIdWithUrnSubscription).resolves(true);

        const subscriptionRes = await subscriptionService.subscribe(userIdWithUrnSubscription);

        sinon.assert.calledWith(removeStub, { 'case-urn': mockCaseWithUrnOnly.caseUrn }, userIdWithUrnSubscription);

        expect(subscriptionRes).toBe(true);
    });
});

describe('removeFromCache function', () => {
    it('should call a function to remove a case from the cache', async () => {
        await subscriptionService.removeFromCache({ case: '888' }, userIdWithSubscriptions);
        sinon.assert.called(removeStub);
    });

    it('should call a function to remove a court from the cache', async () => {
        await subscriptionService.removeFromCache({ court: '111' }, userIdWithSubscriptions);
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

describe('configureListTypeForLocationSubscriptions', () => {
    it('should return a message if list type subscription is updated', async () => {
        const result = await subscriptionService.configureListTypeForLocationSubscriptions(
            '1',
            'CIVIL_DAILY_CAUSE_LIST'
        );
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
    const deleteStub = sinon.stub(SubscriptionRequests.prototype, 'unsubscribe');

    deleteStub.withArgs('ValidSubscriptionId').resolves('Subscription was deleted');
    deleteStub.withArgs('InValidSubscriptionId').resolves(null);

    it('should return a message if subscription is deleted', async () => {
        const payload = await subscriptionService.unsubscribe('ValidSubscriptionId', '2345-2345');
        expect(payload).toEqual('Subscription was deleted');
    });

    it('should return null if subscription delete failed', async () => {
        const payload = await subscriptionService.unsubscribe('InValidSubscriptionId', '2345-2345');
        expect(payload).toEqual(null);
    });
});

describe('bulkDeleteSubscriptions', () => {
    const bulkDeleteStub = sinon.stub(SubscriptionRequests.prototype, 'bulkDeleteSubscriptions');

    bulkDeleteStub.withArgs(['ValidSubscriptionId']).resolves('Subscription was deleted');
    bulkDeleteStub.withArgs(['InValidSubscriptionId']).resolves(null);

    it('should return a message if subscription is deleted', async () => {
        const payload = await subscriptionService.bulkDeleteSubscriptions(['ValidSubscriptionId']);
        expect(payload).toEqual('Subscription was deleted');
    });

    it('should return null if subscription delete failed', async () => {
        const payload = await subscriptionService.bulkDeleteSubscriptions(['InValidSubscriptionId']);
        expect(payload).toEqual(null);
    });
});

describe('generateListTypesForCourts', () => {
    const userId = 1234;
    const subscriptionData = fs.readFileSync(
        path.resolve(__dirname, '../../../test/unit/mocks/listTypeSubscriptions/listTypeSubscriptions.json'),
        'utf-8'
    );
    const returnedSubscriptions = JSON.parse(subscriptionData);

    stubUserSubscription.withArgs(userId).returns(returnedSubscriptions.data);

    it('generate list types with no filters with no selected', async () => {
        locationStub.withArgs(1).resolves({ jurisdiction: ['Civil'] });

        const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', '', '', 'en');

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

    it('Test sorting of lists in english', async () => {
        locationStub.withArgs(1).resolves({ jurisdiction: ['Civil', 'Crown'] });

        const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', '', '', 'en');

        const listOptions = result['listOptions'];
        const listTypes = listOptions['C'];
        const keys = Object.keys(listTypes);

        expect(keys[0]).toEqual('CIVIL_AND_FAMILY_DAILY_CAUSE_LIST');
        expect(keys[5]).toEqual('CROWN_WARNED_LIST');
    });

    it('Test sorting of lists in welsh', async () => {
        locationStub.withArgs(1).resolves({ jurisdiction: ['Civil', 'Crown'] });

        const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', '', '', 'cy');

        const listOptions = result['listOptions'];
        const listTypes = listOptions['R'];
        const keys = Object.keys(listTypes);

        expect(keys[0]).toEqual('COP_DAILY_CAUSE_LIST');
        expect(keys[7]).toEqual('MAGISTRATES_STANDARD_LIST');
    });

    it('generate list types with no filters with no selected in Welsh', async () => {
        locationStub.withArgs(1).resolves({ jurisdiction: ['Civil'] });

        const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', '', '', 'cy');

        expect(result['listOptions']).toBeDefined();
        expect(result['filterOptions']).toBeDefined();

        const listOptions = result['listOptions'];
        expect(listOptions['R']).toBeDefined();

        const listTypes = listOptions['R'];

        expect(listTypes['CIVIL_AND_FAMILY_DAILY_CAUSE_LIST']).toBeDefined();
        expect(listTypes['CIVIL_DAILY_CAUSE_LIST']).toBeDefined();
        expect(listTypes['COP_DAILY_CAUSE_LIST']).toBeDefined();

        const civilAndFamilyCauseList = listTypes['CIVIL_AND_FAMILY_DAILY_CAUSE_LIST'];
        expect(civilAndFamilyCauseList['listFriendlyName']).toEqual('Rhestr Achosion Dyddiol y Llys Sifil a Theulu');
        expect(civilAndFamilyCauseList['checked']).toBeTruthy();

        const civilDailyCauseList = listTypes['CIVIL_DAILY_CAUSE_LIST'];
        expect(civilDailyCauseList['checked']).toBeFalsy();

        const filterOptions = result['filterOptions'];
        expect(filterOptions['Jurisdiction']).toBeDefined();

        const jurisdictionFilter = filterOptions['Jurisdiction'];
        expect(jurisdictionFilter['Llys Sifil']).toBeDefined();
        expect(jurisdictionFilter['Llys Teulu']).toBeDefined();

        const civilFilter = jurisdictionFilter['Llys Sifil'];
        expect(civilFilter['value']).toEqual('Llys Sifil');
        expect(civilFilter['text']).toEqual('Llys Sifil');
        expect(civilFilter['checked']).toBeFalsy();
    });

    it('generate list types with filters selected', async () => {
        locationStub.withArgs(1).resolves({ jurisdiction: ['Civil'] });

        const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', 'Family', '', 'en');

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

    it('generate list types with filters selected in Welsh', async () => {
        locationStub.withArgs(1).resolves({ jurisdiction: ['Civil'] });

        const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', 'Llys Teulu', '', 'cy');

        expect(result['listOptions']).toBeDefined();
        expect(result['filterOptions']).toBeDefined();

        const listOptions = result['listOptions'];
        expect(listOptions['R']).toBeDefined();

        const listTypes = listOptions['R'];
        expect(listTypes['CIVIL_AND_FAMILY_DAILY_CAUSE_LIST']).toBeDefined();
        expect(listTypes['CIVIL_DAILY_CAUSE_LIST']).toBeDefined();
        expect(listTypes['COP_DAILY_CAUSE_LIST']).toBeDefined();

        const civilAndFamilyCauseList = listTypes['CIVIL_AND_FAMILY_DAILY_CAUSE_LIST'];
        expect(civilAndFamilyCauseList['listFriendlyName']).toEqual('Rhestr Achosion Dyddiol y Llys Sifil a Theulu');
        expect(civilAndFamilyCauseList['checked']).toBeTruthy();
        expect(civilAndFamilyCauseList['hidden']).toBeFalsy();

        const civilDailyCauseList = listTypes['CIVIL_DAILY_CAUSE_LIST'];
        expect(civilDailyCauseList['checked']).toBeFalsy();
        expect(civilDailyCauseList['hidden']).toBeTruthy();

        const filterOptions = result['filterOptions'];
        expect(filterOptions['Jurisdiction']).toBeDefined();

        const jurisdictionFilter = filterOptions['Jurisdiction'];
        expect(jurisdictionFilter['Llys Sifil']).toBeDefined();
        expect(jurisdictionFilter['Llys Teulu']).toBeDefined();

        const civilFilter = jurisdictionFilter['Llys Sifil'];
        expect(civilFilter['checked']).toBeFalsy();

        const familyFilter = jurisdictionFilter['Llys Teulu'];
        expect(familyFilter['value']).toEqual('Llys Teulu');
        expect(familyFilter['text']).toEqual('Llys Teulu');
        expect(familyFilter['checked']).toBeTruthy();
    });

    it('generate list types with filters and clear', async () => {
        locationStub.withArgs(1).resolves({ jurisdiction: ['Civil'] });

        const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', 'Family', 'Family', 'en');

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
        locationStub.withArgs(1).resolves(mockCourt);
        const mockSubscriptionData = [{ locationId: 1 }];
        const result = await subscriptionService.generateLocationTableRows(
            mockSubscriptionData,
            'en',
            'subscription-management'
        );

        expect(result[0][0].text).toEqual('Aberdeen Tribunal Hearing Centre');
        expect(result[0][2].html).toContain('Unsubscribe');
    });

    it('should generate location table rows when language is Welsh', async () => {
        locationStub.withArgs(1).resolves(mockCourt);
        const mockSubscriptionData = [{ locationId: 1 }];
        const result = await subscriptionService.generateLocationTableRows(
            mockSubscriptionData,
            'cy',
            'subscription-management'
        );

        expect(result[0][0].text).toEqual('Welsh court name test');
        expect(result[0][2].html).toContain('dad-danysgrifio');
    });

    it('retrieve subscription channels', async () => {
        const subscriptionChannelStub = sinon.stub(SubscriptionRequests.prototype, 'retrieveSubscriptionChannels');
        subscriptionChannelStub.resolves(['CHANNEL_A', 'CHANNEL_B']);

        const retrievedChannels = await subscriptionService.retrieveChannels();

        expect(retrievedChannels).toStrictEqual(['CHANNEL_A', 'CHANNEL_B']);
    });
});

describe('delete location subscription', () => {
    it('should return a message if location subscription is deleted', async () => {
        const payload = await subscriptionService.deleteLocationSubscription(1, requester);
        expect(payload).toEqual('success');
    });

    it('should return null if subscription delete failed', async () => {
        const payload = await subscriptionService.deleteLocationSubscription(2, requester);
        expect(payload).toEqual(null);
    });
});
