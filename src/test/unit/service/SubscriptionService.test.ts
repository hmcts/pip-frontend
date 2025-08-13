import {LocationService} from '../../../main/service/LocationService';
import {PendingSubscriptionsFromCache} from '../../../main/service/PendingSubscriptionsFromCache';
import {SubscriptionRequests} from '../../../main/resources/requests/SubscriptionRequests';
import {SubscriptionService} from '../../../main/service/SubscriptionService';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {PublicationService} from '../../../main/service/PublicationService';
import {
    caseSubscriptionSorter,
    locationSubscriptionSorter,
    pendingListTypeSubscriptionSorter,
} from '../../../main/helpers/sortHelper';

const userIdWithSubscriptions = '1';
const userIdWithoutSubscriptions = '2';
const userIdForSortedSubscriptions = '3';
const userIdWithUrnSubscription = '4';
const userIdWithCaseSubscription = '5';
const userIdWithCourtSubscription = '6';
const userIdWithCourtMultiListTypeSubscription = '7';
const userIdForFailedConfigureListType = '8';

const mockCourt = {
    locationId: 1,
    name: 'Aberdeen Tribunal Hearing Centre',
    welshName: 'Welsh court name test',
    jurisdictionType: ['Criminal Injuries Compensation Tribunal'],
    location: 'Scotland',
};
const mockCourt2 = {
    locationId: 2,
    name: 'Manchester Crown Court',
    welshName: 'Welsh court name test',
    jurisdictionType: ['Crown Court'],
};
const mockCourt3 = {
    locationId: 3,
    name: "Barkingside Magistrates' Court",
    welshName: 'Welsh court name test',
    jurisdictionType: ['Criminal Injuries Compensation Tribunal'],
};
const mockCase = {
    caseNumber: 'CASENUM1234',
    caseName: 'CASENAME1234',
    caseUrn: 'CASEURN1234',
    partyNames: 'PARTYNAME1,\nPARTYNAME2',
    urnSearch: false,
};
const mockCaseWithUrnOnly = {
    caseNumber: null,
    caseName: null,
    caseUrn: 'CASEURN1234',
    partyNames: 'PARTYNAME1,\nPARTYNAME2',
    urnSearch: true,
};
const mockCourtSubscription = {
    subscriptionId: '123',
    locationName: 'Birmingham Social Security and Child Support',
    locationId: '4',
};
const mockCourtSubscription2 = {
    subscriptionId: '124',
    locationName: 'Oxford Combined Court Centre',
    locationId: '3',
};
const mockCourtSubscription3 = {
    subscriptionId: '125',
    locationName: 'Bradford Social Security and Child Support',
    locationId: '5',
};
const mockCaseSubscription = {
    subscriptionId: '123',
    searchType: 'CASE_ID',
    caseName: 'My Case A',
    caseNumber: '2222',
    urn: null,
};
const mockCaseSubscription2 = {
    subscriptionId: '124',
    searchType: 'CASE_ID',
    caseName: 'Another Case',
    caseNumber: '1111',
    urn: null,
};
const mockCaseSubscription3 = {
    subscriptionId: '125',
    searchType: 'CASE_URN',
    caseName: 'My Case A',
    caseNumber: null,
    urn: '1111',
};
const courtSubscriptionPayload = {
    channel: 'EMAIL',
    searchType: 'LOCATION_ID',
    searchValue: 1,
    locationName: 'Aberdeen Tribunal Hearing Centre',
    userId: userIdWithSubscriptions,
};

const caseSubscriptionPayload = {
    caseName: 'CASENAME1234',
    caseNumber: 'CASENUM1234',
    channel: 'EMAIL',
    searchType: 'CASE_ID',
    searchValue: 'CASENUM1234',
    urn: 'CASEURN1234',
    partyNames: 'PARTYNAME1,PARTYNAME2',
    userId: userIdWithSubscriptions,
};

const blankPayload = {
    channel: 'EMAIL',
    searchType: '',
    searchValue: '',
    userId: '5',
};
const mockListType = ['SJP_PUBLIC_LIST'];
const mockLanguage = ['ENGLISH'];
const mockListTypes = ['CIVIL_DAILY_CAUSE_LIST', 'FAMILY_DAILY_CAUSE_LIST'];
const mockLanguages = ['ENGLISH,WELSH'];

const user = {};
const adminUserId = '1234';
const userProvenance = 'PI_AAD';

const subscriptionService = new SubscriptionService();
const stubUserSubscription = sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions');
const rawData2 = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionResult2 = JSON.parse(rawData2);

stubUserSubscription.withArgs(userIdWithSubscriptions).returns(subscriptionResult2.data);
stubUserSubscription.withArgs(userIdForFailedConfigureListType).resolves(subscriptionResult2.data);
stubUserSubscription.withArgs(userIdWithoutSubscriptions).returns({
    locationSubscriptions: [],
    caseSubscriptions: [],
});

const cacheSetStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'setPendingSubscriptions');
const cacheGetStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
const removeStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'removeFromCache');
const getByCaseNumberStub = sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber');
const getCaseByUrnStub = sinon.stub(PublicationService.prototype, 'getCaseByCaseUrn');
const locationStub = sinon.stub(LocationService.prototype, 'getLocationById');
const subscriptionStub = sinon.stub(SubscriptionRequests.prototype, 'subscribe');
const addListTypeSubscriptionStub = sinon.stub(SubscriptionRequests.prototype, 'addListTypeForLocationSubscriptions');
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
cacheSetStub.withArgs('[listType1]', 'listTypes', userIdWithSubscriptions).resolves();
cacheSetStub.withArgs('[LISTLANGUAGE1]', 'listLanguage', userIdWithSubscriptions).resolves();
cacheGetStub.withArgs(userIdWithSubscriptions, 'cases').resolves([mockCase]);
cacheGetStub.withArgs(userIdWithSubscriptions, 'courts').resolves([mockCourt]);
cacheGetStub.withArgs(userIdWithSubscriptions, 'listTypes').resolves(mockListType);
cacheGetStub.withArgs(userIdWithSubscriptions, 'listLanguage').resolves(mockLanguage);
cacheGetStub.withArgs(userIdWithoutSubscriptions).resolves([]);
cacheGetStub
    .withArgs(userIdForSortedSubscriptions, 'cases')
    .resolves([mockCaseSubscription, mockCaseSubscription2, mockCaseSubscription3]);
cacheGetStub
    .withArgs(userIdForSortedSubscriptions, 'courts')
    .resolves([mockCourtSubscription, mockCourtSubscription2, mockCourtSubscription3]);
cacheGetStub.withArgs(userIdForSortedSubscriptions, 'listTypes').resolves(mockListTypes);
addListTypeSubscriptionStub.withArgs(userIdWithSubscriptions).resolves(true);
addListTypeSubscriptionStub.withArgs(userIdWithCourtMultiListTypeSubscription).resolves(true);
updateListTypeSubscriptionStub.withArgs(userIdWithSubscriptions).resolves(true);
updateListTypeSubscriptionStub.withArgs(null).resolves(false);
updateListTypeSubscriptionStub.withArgs(null).resolves(false);
updateListTypeSubscriptionStub.withArgs(userIdForFailedConfigureListType).resolves(false);
deleteStubLocation.withArgs(1, adminUserId).returns('success');
deleteStubLocation.withArgs(2, adminUserId).returns(null);

describe('getSubscriptionDataForView function', () => {
    locationStub.withArgs(1).resolves(mockCourt);

    describe('for Subscription Management page', () => {
        it("should return subscription data for 'all' tab", async () => {
            const result = await subscriptionService.getSubscriptionDataForView(userIdWithSubscriptions, 'en', 'all');
            const subscriptionData = JSON.parse(JSON.stringify(result));

            expect(subscriptionData.caseTableData).toHaveLength(6);
            const caseDataRow = subscriptionData.caseTableData[0];
            expect(caseDataRow.subscriptionId).toEqual('5a45699f-47e3-4283-904a-581afe624155');
            expect(caseDataRow.caseName).toEqual('Test Name');
            expect(caseDataRow.partyNames).toEqual('PARTYNAME3');
            expect(caseDataRow.caseRef).toEqual('C123123');

            expect(subscriptionData.locationTableData).toHaveLength(3);
            const locationDataRow = subscriptionData.locationTableData[0];
            expect(locationDataRow.subscriptionId).toEqual('d5b65f6f-4c43-45f7-a52d-d2c5cf8ac0e6');
            expect(locationDataRow.locationName).toEqual('Aberdeen Tribunal Hearing Centre');

            expect(subscriptionData.activeAllTab).toBeTruthy();
            expect(subscriptionData.activeCaseTab).toBeFalsy();
            expect(subscriptionData.activeLocationTab).toBeFalsy();
        });

        it("should return subscription data for 'case' tab", async () => {
            const result = await subscriptionService.getSubscriptionDataForView(userIdWithSubscriptions, 'en', 'case');
            const subscriptionData = JSON.parse(JSON.stringify(result));

            expect(subscriptionData.caseTableData).toHaveLength(6);
            const caseDataRow = subscriptionData.caseTableData[0];
            expect(caseDataRow.subscriptionId).toEqual('5a45699f-47e3-4283-904a-581afe624155');
            expect(caseDataRow.caseName).toEqual('Test Name');
            expect(caseDataRow.partyNames).toEqual('PARTYNAME3');
            expect(caseDataRow.caseRef).toEqual('C123123');

            expect(subscriptionData.locationTableData).toHaveLength(3);
            const locationDataRow = subscriptionData.locationTableData[0];
            expect(locationDataRow.subscriptionId).toEqual('d5b65f6f-4c43-45f7-a52d-d2c5cf8ac0e6');
            expect(locationDataRow.locationName).toEqual('Aberdeen Tribunal Hearing Centre');

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
            expect(caseDataRow.subscriptionId).toEqual('5a45699f-47e3-4283-904a-581afe624155');
            expect(caseDataRow.caseName).toEqual('Test Name');
            expect(caseDataRow.partyNames).toEqual('PARTYNAME3');
            expect(caseDataRow.caseRef).toEqual('C123123');

            expect(subscriptionData.locationTableData).toHaveLength(3);
            const locationDataRow = subscriptionData.locationTableData[0];
            expect(locationDataRow.subscriptionId).toEqual('d5b65f6f-4c43-45f7-a52d-d2c5cf8ac0e6');
            expect(locationDataRow.locationName).toEqual('Aberdeen Tribunal Hearing Centre');

            expect(subscriptionData.activeAllTab).toBeFalsy();
            expect(subscriptionData.activeCaseTab).toBeFalsy();
            expect(subscriptionData.activeLocationTab).toBeTruthy();
        });

        it('should sort case subscription data by case name and case reference', async () => {
            const result = await subscriptionService.getSubscriptionDataForView(userIdWithSubscriptions, 'en', 'case');
            const subscriptionData = JSON.parse(JSON.stringify(result));
            const firstRow = subscriptionData.caseTableData[0];
            expect(firstRow.caseName).toEqual('Test Name');
            expect(firstRow.partyNames).toEqual('PARTYNAME3');
            expect(firstRow.caseRef).toEqual('C123123');

            const secondRow = subscriptionData.caseTableData[1];
            expect(secondRow.caseName).toEqual('Test Name 2');
            expect(secondRow.partyNames).toEqual('');
            expect(secondRow.caseRef).toEqual('I123123');

            const thirdRow = subscriptionData.caseTableData[2];
            expect(thirdRow.caseName).toEqual('Test Name 3');
            expect(thirdRow.partyNames).toEqual('');
            expect(thirdRow.caseRef).toEqual('1212121212');

            const fourthRow = subscriptionData.caseTableData[3];
            expect(fourthRow.caseName).toEqual('Test Name 3');
            expect(fourthRow.partyNames).toEqual('');
            expect(fourthRow.caseRef).toEqual('B123123');

            const fifthRow = subscriptionData.caseTableData[4];
            expect(fifthRow.caseName).toEqual('');
            expect(fifthRow.partyNames).toEqual('');
            expect(fifthRow.caseRef).toEqual('A123123');

            const sixthRow = subscriptionData.caseTableData[5];
            expect(sixthRow.caseName).toEqual('');
            expect(sixthRow.partyNames).toEqual('PARTYNAME1,\nPARTYNAME2');
            expect(sixthRow.caseRef).toEqual('D123123');
        });

        it('should sort location subscription data by court name', async () => {
            const result = await subscriptionService.getSubscriptionDataForView(
                userIdWithSubscriptions,
                'en',
                'location'
            );
            const subscriptionData = JSON.parse(JSON.stringify(result));

            expect(subscriptionData.locationTableData[0].locationName).toEqual('Aberdeen Tribunal Hearing Centre');
            expect(subscriptionData.locationTableData[1].locationName).toEqual("Barkingside Magistrates' Court");
            expect(subscriptionData.locationTableData[2].locationName).toEqual('Manchester Crown Court');
        });

        it('should sort location when duplicate location subscription is set', async () => {
            const locationDuplicateSubscription = fs.readFileSync(
                path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptionsLocationDuplicate.json'),
                'utf-8'
            );
            stubUserSubscription.withArgs('12341234').resolves(JSON.parse(locationDuplicateSubscription).data);

            const result = await subscriptionService.getSubscriptionDataForView('12341234', 'en', 'location');
            const subscriptionData = JSON.parse(JSON.stringify(result));
            expect(subscriptionData.locationTableData[0].locationName).toEqual('Manchester Crown Court');
            expect(subscriptionData.locationTableData[1].locationName).toEqual('Manchester Crown Court');
        });

        it('should sort case name when there are null in names and numbers/urns', async () => {
            const locationDuplicateSubscription = fs.readFileSync(
                path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptionsSingleCaseAndWithoutCaseName.json'),
                'utf-8'
            );
            stubUserSubscription.withArgs('1948291848').resolves(JSON.parse(locationDuplicateSubscription).data);

            const result = await subscriptionService.getSubscriptionDataForView('1948291848', 'en', 'case');
            const subscriptionData = JSON.parse(JSON.stringify(result));
            expect(subscriptionData.caseTableData[0].caseName).toBe('Case Name');
            expect(subscriptionData.caseTableData[0].caseRef).toEqual('1234');
            expect(subscriptionData.caseTableData[0].partyNames).toEqual('');

            expect(subscriptionData.caseTableData[1].caseName).toBe('Case Name');
            expect(subscriptionData.caseTableData[1].caseRef).toEqual('1234512345');
            expect(subscriptionData.caseTableData[1].partyNames).toEqual('PARTYNAME3');

            expect(subscriptionData.caseTableData[2].caseName).toBe('Case Name');
            expect(subscriptionData.caseTableData[2].caseRef).toEqual('1234512345');
            expect(subscriptionData.caseTableData[2].partyNames).toEqual('');

            expect(subscriptionData.caseTableData[3].caseName).toBe('Case Name');
            expect(subscriptionData.caseTableData[3].caseRef).toEqual('');
            expect(subscriptionData.caseTableData[3].partyNames).toEqual('');

            expect(subscriptionData.caseTableData[4].caseName).toEqual('');
            expect(subscriptionData.caseTableData[4].caseRef).toEqual('1234512346');
            expect(subscriptionData.caseTableData[4].partyNames).toEqual('PARTYNAME1,\nPARTYNAME2');
        });
    });
});

describe('getSelectedSubscriptionDataForView function', () => {
    it('should return selected case subscriptions only', async () => {
        const subscriptionsToDelete = ['952899d6-2b05-43ec-86e0-a438d3854fa8', '5a45699f-47e3-4283-904a-581afe624155'];
        const result = await subscriptionService.getSelectedSubscriptionDataForView(
            userIdWithSubscriptions,
            'en',
            subscriptionsToDelete
        );
        const subscriptionData = JSON.parse(JSON.stringify(result));

        expect(subscriptionData.caseTableData).toHaveLength(2);
        expect(subscriptionData.locationTableData).toHaveLength(0);
        const caseDataRow = subscriptionData.caseTableData[0];
        expect(caseDataRow.subscriptionId).toEqual('5a45699f-47e3-4283-904a-581afe624155');
        expect(caseDataRow.caseName).toEqual('Test Name');
        expect(caseDataRow.partyNames).toEqual('PARTYNAME3');
        expect(caseDataRow.caseRef).toEqual('C123123');
    });

    it('should return selected location subscriptions only', async () => {
        const subscriptionsToDelete = ['f038b7ea-2972-4be4-a5ff-70abb4f78686', 'd5b65f6f-4c43-45f7-a52d-d2c5cf8ac0e6'];
        const result = await subscriptionService.getSelectedSubscriptionDataForView(
            userIdWithSubscriptions,
            'en',
            subscriptionsToDelete
        );
        const subscriptionData = JSON.parse(JSON.stringify(result));

        expect(subscriptionData.caseTableData).toHaveLength(0);
        expect(subscriptionData.locationTableData).toHaveLength(2);
        const locationDataRow = subscriptionData.locationTableData[0];
        expect(locationDataRow.subscriptionId).toEqual('d5b65f6f-4c43-45f7-a52d-d2c5cf8ac0e6');
        expect(locationDataRow.locationName).toEqual('Aberdeen Tribunal Hearing Centre');
    });

    it('should return selected case subscriptions and location subscriptions', async () => {
        const subscriptionsToDelete = [
            '952899d6-2b05-43ec-86e0-a438d3854fa8',
            '5a45699f-47e3-4283-904a-581afe624155',
            'f038b7ea-2972-4be4-a5ff-70abb4f78686',
            'd5b65f6f-4c43-45f7-a52d-d2c5cf8ac0e6',
        ];
        const result = await subscriptionService.getSelectedSubscriptionDataForView(
            userIdWithSubscriptions,
            'en',
            subscriptionsToDelete
        );
        const subscriptionData = JSON.parse(JSON.stringify(result));

        expect(subscriptionData.caseTableData).toHaveLength(2);
        const caseDataRow = subscriptionData.caseTableData[0];
        expect(caseDataRow.subscriptionId).toEqual('5a45699f-47e3-4283-904a-581afe624155');
        expect(caseDataRow.caseName).toEqual('Test Name');
        expect(caseDataRow.partyNames).toEqual('PARTYNAME3');
        expect(caseDataRow.caseRef).toEqual('C123123');

        expect(subscriptionData.locationTableData).toHaveLength(2);
        const locationDataRow = subscriptionData.locationTableData[0];
        expect(locationDataRow.subscriptionId).toEqual('d5b65f6f-4c43-45f7-a52d-d2c5cf8ac0e6');
        expect(locationDataRow.locationName).toEqual('Aberdeen Tribunal Hearing Centre');
    });

    it('should return nothing if no subscription to delete', async () => {
        const result = await subscriptionService.getSelectedSubscriptionDataForView(userIdWithSubscriptions, 'en', []);
        const subscriptionData = JSON.parse(JSON.stringify(result));

        expect(subscriptionData.caseTableData).toHaveLength(0);
        expect(subscriptionData.locationTableData).toHaveLength(0);
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
        const pendingSubscription = { 'case-urn': 'URNCASE1234' };
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

    it('should add list type to cache for court subscription', async () => {
        const pendingSubscription = { 'list-selections[]': ['listType1'] };

        await subscriptionService.handleNewSubscription(pendingSubscription, user);

        sinon.assert.calledWith(cacheSetStub, ['listType1'], 'listTypes', user['userId']);
    });

    it('should add list language to cache for court subscription', async () => {
        const pendingSubscription = { 'list-language': 'listLanguage1' };

        await subscriptionService.handleNewSubscription(pendingSubscription, user);

        sinon.assert.calledWith(cacheSetStub, ['LISTLANGUAGE1'], 'listLanguage', user['userId']);
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
        await subscriptionService.setPendingSubscriptions([], 'cases', userIdWithSubscriptions);
        sinon.assert.called(cacheSetStub);
    });

    it('should call cases cache set with cases', async () => {
        await subscriptionService.setPendingSubscriptions([mockCase], 'cases', userIdWithSubscriptions);
        sinon.assert.called(cacheSetStub);
    });

    it('should call courts cache set without courts provided', async () => {
        await subscriptionService.setPendingSubscriptions([], 'courts', userIdWithSubscriptions);
        sinon.assert.called(cacheSetStub);
    });

    it('should call courts cache set with courts', async () => {
        await subscriptionService.setPendingSubscriptions([mockCourt], 'courts', userIdWithSubscriptions);
        sinon.assert.called(cacheSetStub);
    });

    it('should call list type cache set without list types provided', async () => {
        await subscriptionService.setPendingSubscriptions([], 'listTypes', userIdWithSubscriptions);
        sinon.assert.called(cacheSetStub);
    });

    it('should call list type cache set with list types', async () => {
        await subscriptionService.setPendingSubscriptions([mockListType], 'listTypes', userIdWithSubscriptions);
        sinon.assert.called(cacheSetStub);
    });

    it('should call list language cache set without list language provided', async () => {
        await subscriptionService.setPendingSubscriptions([], 'listLanguage', userIdWithSubscriptions);
        sinon.assert.called(cacheSetStub);
    });

    it('should call list language cache set with list language', async () => {
        await subscriptionService.setPendingSubscriptions([mockLanguage], 'listLanguage', userIdWithSubscriptions);
        sinon.assert.called(cacheSetStub);
    });
});

describe('getPendingSubscriptions function', () => {
    it('should return list of cached courts', async () => {
        const cachedCourts = await subscriptionService.getPendingSubscriptions(userIdWithSubscriptions, 'courts');
        expect(cachedCourts).toStrictEqual([mockCourt]);
    });

    it('should return list of cached cases', async () => {
        const cachedCases = await subscriptionService.getPendingSubscriptions(userIdWithSubscriptions, 'cases');
        expect(cachedCases).toStrictEqual([mockCase]);
    });

    it('should return empty list of courts from the cache', async () => {
        const cachedCourts = await subscriptionService.getPendingSubscriptions(userIdWithoutSubscriptions, 'courts');
        expect(cachedCourts).toEqual([]);
    });

    it('should return empty list of cases from the cache', async () => {
        const cachedCases = await subscriptionService.getPendingSubscriptions(userIdWithoutSubscriptions, 'cases');
        expect(cachedCases).toEqual([]);
    });

    it('should return empty court list type from the cache', async () => {
        const cachedCourtListTypes = await subscriptionService.getPendingSubscriptions(
            userIdWithoutSubscriptions,
            'listTypes'
        );
        expect(cachedCourtListTypes).toEqual([]);
    });

    it('should return court list type from the cache', async () => {
        const cachedCourtListTypes = await subscriptionService.getPendingSubscriptions(
            userIdWithSubscriptions,
            'listTypes'
        );
        expect(cachedCourtListTypes).toStrictEqual(mockListType);
    });

    it('should return empty list language from the cache', async () => {
        const cachedListLanguage = await subscriptionService.getPendingSubscriptions(
            userIdWithoutSubscriptions,
            'listLanguage'
        );
        expect(cachedListLanguage).toEqual([]);
    });

    it('should return list language from the cache', async () => {
        const cachedListLanguage = await subscriptionService.getPendingSubscriptions(
            userIdWithSubscriptions,
            'listLanguage'
        );
        expect(cachedListLanguage).toStrictEqual(mockLanguage);
    });
});

describe('getSortedPendingSubscriptions function', () => {
    it('should return sorted court subscription list', async () => {
        const courts = await subscriptionService.getSortedPendingSubscriptions(
            userIdForSortedSubscriptions,
            'courts',
            locationSubscriptionSorter
        );
        expect(courts).toStrictEqual([mockCourtSubscription, mockCourtSubscription3, mockCourtSubscription2]);
    });

    it('should return sorted case subscription list', async () => {
        const courts = await subscriptionService.getSortedPendingSubscriptions(
            userIdForSortedSubscriptions,
            'cases',
            caseSubscriptionSorter
        );
        expect(courts).toStrictEqual([mockCaseSubscription2, mockCaseSubscription3, mockCaseSubscription]);
    });

    it('should return sorted list types', async () => {
        const listTypes = await subscriptionService.getSortedPendingSubscriptions(
            userIdForSortedSubscriptions,
            'listTypes',
            pendingListTypeSubscriptionSorter
        );
        expect(listTypes).toStrictEqual(mockListTypes);
    });
});

describe('subscribe function', () => {
    const subscribeMockCourt = {
        locationId: 1,
        name: 'Aberdeen Tribunal Hearing Centre',
        welshName: 'Welsh court name test',
        jurisdiction: 'Tribunal',
        location: 'Scotland',
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
    cacheGetStub.withArgs(userIdWithCourtSubscription, 'listTypes').resolves(mockListType);
    cacheGetStub.withArgs(userIdWithCourtSubscription, 'listLanguage').resolves(mockLanguage);
    cacheGetStub.withArgs(userIdWithCourtMultiListTypeSubscription, 'courts').resolves([subscribeMockCourt]);
    cacheGetStub.withArgs(userIdWithCourtMultiListTypeSubscription, 'listTypes').resolves(mockListTypes);
    cacheGetStub.withArgs(userIdWithCourtMultiListTypeSubscription, 'listLanguage').resolves(mockLanguages);
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
            userId: userIdWithCourtSubscription,
        };

        const listTypePayload = {
            listType: ['SJP_PUBLIC_LIST'],
            listLanguage: ['ENGLISH'],
            userId: userIdWithCourtSubscription,
        };

        subscriptionStub.withArgs(courtSubscription, userIdWithCourtSubscription).resolves(true);
        addListTypeSubscriptionStub.withArgs(userIdWithCourtSubscription, listTypePayload).resolves(true);

        const subscriptionRes = await subscriptionService.subscribe(userIdWithCourtSubscription);
        expect(subscriptionRes).toBe(true);
    });

    it('should return true for successful subscription where no existing subs - court subscription with multi list types', async () => {
        const courtSubscription = {
            channel: 'EMAIL',
            searchType: 'LOCATION_ID',
            searchValue: subscribeMockCourt.locationId,
            locationName: subscribeMockCourt.name,
            userId: userIdWithCourtMultiListTypeSubscription,
        };

        const listTypePayload = {
            listType: ['CIVIL_DAILY_CAUSE_LIST', 'FAMILY_DAILY_CAUSE_LIST'],
            listLanguage: ['ENGLISH', 'WELSH'],
            userId: userIdWithCourtMultiListTypeSubscription,
        };

        subscriptionStub.withArgs(courtSubscription, userIdWithCourtMultiListTypeSubscription).resolves(true);
        addListTypeSubscriptionStub.withArgs(userIdWithCourtMultiListTypeSubscription, listTypePayload).resolves(true);

        const subscriptionRes = await subscriptionService.subscribe(userIdWithCourtMultiListTypeSubscription);
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
            partyNames: mockCase.partyNames.split(',\n').join(','),
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
            partyNames: mockCaseWithUrnOnly.partyNames.split(',\n').join(','),
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
            userIdWithSubscriptions,
            ['CIVIL_DAILY_CAUSE_LIST'],
            ['ENGLISH']
        );
        expect(result).toEqual(true);
    });

    it('should return a message if multiple list type subscription is updated', async () => {
        const result = await subscriptionService.configureListTypeForLocationSubscriptions(
            '1',
            ['CIVIL_DAILY_CAUSE_LIST', 'FAMILY_DAILY_CAUSE_LIST'],
            ['ENGLISH']
        );
        expect(result).toEqual(true);
    });

    it('should return a message if empty list type subscription is updated', async () => {
        const result = await subscriptionService.configureListTypeForLocationSubscriptions('1', [], []);
        expect(result).toEqual(true);
    });

    it('should return false if user id is not given', async () => {
        const result = await subscriptionService.configureListTypeForLocationSubscriptions(null, [], []);
        expect(result).toEqual(false);
    });
});

describe('getUserSubscriptionListLanguage', () => {
    it('should return a language if user has location subscription', async () => {
        const result = await subscriptionService.getUserSubscriptionListLanguage(userIdWithSubscriptions);
        expect(result).toEqual('ENGLISH');
    });

    it('should return empty if user has no location subscription', async () => {
        const result = await subscriptionService.getUserSubscriptionListLanguage(userIdWithoutSubscriptions);
        expect(result).toEqual('');
    });
});

describe('unsubscribing', () => {
    const deleteStub = sinon.stub(SubscriptionRequests.prototype, 'unsubscribe');

    deleteStub.withArgs('ValidSubscriptionId').resolves(true);
    deleteStub.withArgs('InValidSubscriptionId').resolves(false);

    it('should return true if subscription is deleted', async () => {
        const response = await subscriptionService.unsubscribe(
            'ValidSubscriptionId',
            userIdWithSubscriptions,
            userProvenance
        );
        expect(response).toBeTruthy();
    });

    it('should return false if subscription delete failed', async () => {
        const response = await subscriptionService.unsubscribe(
            'InValidSubscriptionId',
            userIdWithSubscriptions,
            userProvenance
        );
        expect(response).toBeFalsy();
    });

    it('should return true if unsubscribe is successful but no location subscription remained', async () => {
        const response = await subscriptionService.unsubscribe(
            'ValidSubscriptionId',
            userIdWithoutSubscriptions,
            userProvenance
        );
        expect(response).toBeTruthy();
    });

    it('should return false if unsubscribe is successful but failed to configure list type subscriptions', async () => {
        const response = await subscriptionService.unsubscribe(
            'ValidSubscriptionId',
            userIdForFailedConfigureListType,
            userProvenance
        );
        expect(response).toBeFalsy();
    });
});

describe('bulkDeleteSubscriptions', () => {
    const bulkDeleteStub = sinon.stub(SubscriptionRequests.prototype, 'bulkDeleteSubscriptions');

    bulkDeleteStub.withArgs(['ValidSubscriptionId']).resolves(true);
    bulkDeleteStub.withArgs(['InValidSubscriptionId']).resolves(false);

    it('should return true if subscription is deleted', async () => {
        const response = await subscriptionService.bulkDeleteSubscriptions(
            ['ValidSubscriptionId'],
            userIdWithSubscriptions,
            userProvenance
        );
        expect(response).toBeTruthy();
    });

    it('should return false if subscription delete failed', async () => {
        const response = await subscriptionService.bulkDeleteSubscriptions(
            ['InValidSubscriptionId'],
            userIdWithSubscriptions,
            userProvenance
        );
        expect(response).toBeFalsy();
    });

    it('should return true if subscription delete is successful but no location subscription remained', async () => {
        const response = await subscriptionService.bulkDeleteSubscriptions(
            ['ValidSubscriptionId'],
            userIdWithoutSubscriptions,
            userProvenance
        );
        expect(response).toBeTruthy();
    });

    it('should return false if subscription delete is successful but failed to configure list type subscriptions', async () => {
        const response = await subscriptionService.bulkDeleteSubscriptions(
            ['ValidSubscriptionId'],
            userIdForFailedConfigureListType,
            userProvenance
        );
        expect(response).toBeFalsy();
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
    locationStub.withArgs(9).resolves({ jurisdictionType: ['Magistrates Court'] });

    it('Test sorting of lists in english', async () => {
        locationStub
            .withArgs(1)
            .resolves({ jurisdictionType: ['Civil Court', 'Family Court', 'Crown Court', 'High Court'] });

        const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', 'en');

        const listKeysC = Object.keys(result['C']);
        expect(listKeysC).toEqual([
            'CHANCERY_APPEALS_CHD_DAILY_CAUSE_LIST',
            'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
            'CIVIL_COURTS_RCJ_DAILY_CAUSE_LIST',
            'CIVIL_DAILY_CAUSE_LIST',
            'COMMERCIAL_COURT_KB_DAILY_CAUSE_LIST',
            'COMPANIES_WINDING_UP_CHD_DAILY_CAUSE_LIST',
            'COMPETITION_LIST_CHD_DAILY_CAUSE_LIST',
            'COUNTY_COURT_LONDON_CIVIL_DAILY_CAUSE_LIST',
            'COP_DAILY_CAUSE_LIST',
            'CROWN_DAILY_LIST',
            'CROWN_FIRM_LIST',
            'CROWN_WARNED_LIST',
        ]);

        const listKeysM = Object.keys(result['M']);
        expect(listKeysM).toEqual([
            'MAGISTRATES_PUBLIC_LIST',
            'MAGISTRATES_STANDARD_LIST',
            'MANCHESTER_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
            'MAYOR_AND_CITY_CIVIL_DAILY_CAUSE_LIST',
        ]);

        const listKeysS = Object.keys(result['S']);
        expect(listKeysS).toEqual([
            'SENIOR_COURTS_COSTS_OFFICE_DAILY_CAUSE_LIST',
            'SJP_PRESS_LIST',
            'SJP_DELTA_PRESS_LIST',
            'SJP_PRESS_REGISTER',
            'SJP_PUBLIC_LIST',
            'SJP_DELTA_PUBLIC_LIST',
        ]);
    });

    it('Test sorting of lists in welsh', async () => {
        locationStub
            .withArgs(1)
            .resolves({ jurisdictionType: ['Civil Court', 'Family Court', 'Crown Court', 'High Court'] });

        const result = await subscriptionService.generateListTypesForCourts(userId, 'PI_AAD', 'cy');

        const listKeysC = Object.keys(result['C']);
        expect(listKeysC).toEqual([
            'CHANCERY_APPEALS_CHD_DAILY_CAUSE_LIST',
            'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
            'CIVIL_COURTS_RCJ_DAILY_CAUSE_LIST',
            'CIVIL_DAILY_CAUSE_LIST',
            'COMMERCIAL_COURT_KB_DAILY_CAUSE_LIST',
            'COMPANIES_WINDING_UP_CHD_DAILY_CAUSE_LIST',
            'COMPETITION_LIST_CHD_DAILY_CAUSE_LIST',
            'COUNTY_COURT_LONDON_CIVIL_DAILY_CAUSE_LIST',
            'COP_DAILY_CAUSE_LIST',
            'CROWN_DAILY_LIST',
            'CROWN_FIRM_LIST',
            'CROWN_WARNED_LIST',
        ]);

        const listKeysM = Object.keys(result['M']);
        expect(listKeysM).toEqual([
            'MAGISTRATES_PUBLIC_LIST',
            'MAGISTRATES_STANDARD_LIST',
            'MANCHESTER_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
            'MAYOR_AND_CITY_CIVIL_DAILY_CAUSE_LIST',
        ]);

        const listKeysS = Object.keys(result['S']);
        expect(listKeysS).toEqual([
            'SENIOR_COURTS_COSTS_OFFICE_DAILY_CAUSE_LIST',
            'SJP_PRESS_LIST',
            'SJP_DELTA_PRESS_LIST',
            'SJP_PRESS_REGISTER',
            'SJP_PUBLIC_LIST',
            'SJP_DELTA_PUBLIC_LIST',
        ]);
    });

    it('retrieve subscription channels', async () => {
        const subscriptionChannelStub = sinon.stub(SubscriptionRequests.prototype, 'retrieveSubscriptionChannels');
        subscriptionChannelStub.resolves(['CHANNEL_A', 'CHANNEL_B']);

        const retrievedChannels = await subscriptionService.retrieveChannels(userId, adminUserId);

        expect(retrievedChannels).toStrictEqual(['CHANNEL_A', 'CHANNEL_B']);
    });
});

describe('generate case table rows', () => {
    it('should generate case table rows when language is English', async () => {
        const mockSubscriptionData = [
            {
                subscriptionId: 99,
                caseName: 'myCaseName',
                partyNames: null,
                caseNumber: '1234',
                searchType: 'CASE_ID',
                dateAdded: '2023-04-01T16:49:26.607904',
            },
        ];
        const results = await subscriptionService.generateCaseTableRows(mockSubscriptionData, 'en');

        expect(results.length).toEqual(1);
        expect(results[0].subscriptionId).toEqual(99);
        expect(results[0].caseName).toEqual('myCaseName');
        expect(results[0].partyNames).toEqual('');
        expect(results[0].caseRef).toEqual('1234');
        expect(results[0].date).toEqual('01 April 2023');
    });

    it('should generate case table rows when language is Welsh', async () => {
        const mockSubscriptionData = [
            {
                subscriptionId: 99,
                caseName: 'myCaseName',
                partyNames: null,
                caseNumber: '1234',
                searchType: 'CASE_ID',
                dateAdded: '2023-04-01T16:49:26.607904',
            },
        ];
        const results = await subscriptionService.generateCaseTableRows(mockSubscriptionData, 'cy');

        expect(results.length).toEqual(1);
        expect(results[0].subscriptionId).toEqual(99);
        expect(results[0].caseName).toEqual('myCaseName');
        expect(results[0].partyNames).toEqual('');
        expect(results[0].caseRef).toEqual('1234');
        expect(results[0].date).toEqual('01 Ebrill 2023');
    });
});

describe('generate location table rows', () => {
    it('should generate location table rows when language is English', async () => {
        locationStub.withArgs(1).resolves(mockCourt);
        const mockSubscriptionData = [{ locationId: 1, subscriptionId: 99, dateAdded: '2023-05-31T16:49:26.607904' }];
        const results = await subscriptionService.generateLocationTableRows(mockSubscriptionData, 'en');

        expect(results.length).toEqual(1);
        expect(results[0].subscriptionId).toEqual(99);
        expect(results[0].locationName).toEqual('Aberdeen Tribunal Hearing Centre');
        expect(results[0].date).toEqual('31 May 2023');
    });

    it('should generate location table rows when language is Welsh', async () => {
        locationStub.withArgs(1).resolves(mockCourt);
        const mockSubscriptionData = [{ locationId: 1, subscriptionId: 99, dateAdded: '2023-05-31T16:49:26.607904' }];
        const results = await subscriptionService.generateLocationTableRows(mockSubscriptionData, 'cy');

        expect(results.length).toEqual(1);
        expect(results[0].subscriptionId).toEqual(99);
        expect(results[0].locationName).toEqual('Welsh court name test');
        expect(results[0].date).toEqual('31 Mai 2023');
    });
});

describe('delete location subscription', () => {
    it('should return a message if location subscription is deleted', async () => {
        const payload = await subscriptionService.deleteLocationSubscription(1, adminUserId);
        expect(payload).toEqual('success');
    });

    it('should return null if subscription delete failed', async () => {
        const payload = await subscriptionService.deleteLocationSubscription(2, adminUserId);
        expect(payload).toEqual(null);
    });
});

describe('generateListTypeForCourts', () => {
    const userId = 1234;
    const subscriptionData = fs.readFileSync(
        path.resolve(__dirname, '../../../test/unit/mocks/listTypeSubscriptions/listTypeSubscriptions.json'),
        'utf-8'
    );
    const returnedSubscriptions = JSON.parse(subscriptionData);

    stubUserSubscription.withArgs(userId).returns(returnedSubscriptions.data);
    locationStub.withArgs(9).resolves({ jurisdictionType: ['Magistrates Court'] });
    cacheGetStub.withArgs(userId, 'courts').resolves([mockCourt]);

    it('Test sorting of lists in english', async () => {
        locationStub.withArgs(1).resolves({
            jurisdictionType: ['Civil Court', 'Crown Court', 'Family Court', 'Magistrates Court', 'High Court'],
        });

        const result = await subscriptionService.generateListTypeForCourts('PI_AAD', 'en', userId);

        const listKeysC = Object.keys(result['C']);
        expect(listKeysC).toEqual([
            'CHANCERY_APPEALS_CHD_DAILY_CAUSE_LIST',
            'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
            'CIVIL_COURTS_RCJ_DAILY_CAUSE_LIST',
            'CIVIL_DAILY_CAUSE_LIST',
            'COMMERCIAL_COURT_KB_DAILY_CAUSE_LIST',
            'COMPANIES_WINDING_UP_CHD_DAILY_CAUSE_LIST',
            'COMPETITION_LIST_CHD_DAILY_CAUSE_LIST',
            'COUNTY_COURT_LONDON_CIVIL_DAILY_CAUSE_LIST',
            'COP_DAILY_CAUSE_LIST',
            'CROWN_DAILY_LIST',
            'CROWN_FIRM_LIST',
            'CROWN_WARNED_LIST',
        ]);

        const listKeysM = Object.keys(result['M']);
        expect(listKeysM).toEqual([
            'MAGISTRATES_PUBLIC_LIST',
            'MAGISTRATES_STANDARD_LIST',
            'MANCHESTER_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
            'MAYOR_AND_CITY_CIVIL_DAILY_CAUSE_LIST',
        ]);
    });

    it('Test only sorting of lists in welsh', async () => {
        locationStub.withArgs(1).resolves({
            jurisdictionType: ['Civil Court', 'Crown Court', 'Family Court', 'Magistrates Court', 'High Court'],
        });

        const result = await subscriptionService.generateListTypeForCourts('PI_AAD', 'cy', userId);

        const listKeysC = Object.keys(result['C']);
        expect(listKeysC).toEqual([
            'CHANCERY_APPEALS_CHD_DAILY_CAUSE_LIST',
            'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
            'CIVIL_COURTS_RCJ_DAILY_CAUSE_LIST',
            'CIVIL_DAILY_CAUSE_LIST',
            'COMMERCIAL_COURT_KB_DAILY_CAUSE_LIST',
            'COMPANIES_WINDING_UP_CHD_DAILY_CAUSE_LIST',
            'COMPETITION_LIST_CHD_DAILY_CAUSE_LIST',
            'COUNTY_COURT_LONDON_CIVIL_DAILY_CAUSE_LIST',
            'COP_DAILY_CAUSE_LIST',
            'CROWN_DAILY_LIST',
            'CROWN_FIRM_LIST',
            'CROWN_WARNED_LIST',
        ]);

        const listKeysM = Object.keys(result['M']);
        expect(listKeysM).toEqual([
            'MAGISTRATES_PUBLIC_LIST',
            'MAGISTRATES_STANDARD_LIST',
            'MANCHESTER_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
            'MAYOR_AND_CITY_CIVIL_DAILY_CAUSE_LIST',
        ]);
    });

    it('Test lists types conversion to welsh language', async () => {
        locationStub.withArgs(1).resolves({ jurisdictionType: ['Civil Court', 'Crown Court'] });

        const result = await subscriptionService.generateListTypeForCourts('PI_AAD', 'cy', userId);

        expect(result['C']['CIVIL_DAILY_CAUSE_LIST'].listFriendlyName).toEqual(
            'Civil Daily Cause List\nRhestr Achosion Dyddiol y Llys Sifil'
        );

        expect(result['C']['CROWN_DAILY_LIST'].listFriendlyName).toEqual(
            'Crown Daily List\nRhestr Ddyddiol Llys y Goron'
        );
    });
});

describe('populateListTypesFriendlyName', () => {
    const listName = ['SSCS_DAILY_LIST_ADDITIONAL_HEARINGS'];

    it('Get List Type Display name in english', async () => {
        const result = await subscriptionService.populateListTypesFriendlyName(listName, 'en');
        expect(result[0]['text']).toEqual(
            'Social Security and Child Support Tribunal Daily List - Additional Hearings'
        );
    });

    it('Get List Type Display name in welsh', async () => {
        const result = await subscriptionService.populateListTypesFriendlyName(listName, 'cy');
        expect(result[0]['text']).toEqual(
            'Rhestr Ddyddiol y Tribiwnlys Nawdd Cymdeithasol a Chynnal Plant - Gwrandawiadau Ychwanegol'
        );
    });
});

describe('removeListTypeForCourt', () => {
    const userId = 1234;
    locationStub.withArgs(10).resolves({ jurisdictionType: ['Social Security and Child Support'] });
    cacheGetStub.withArgs(userId, 'courts').resolves([mockCourt]);
    cacheGetStub
        .withArgs(userId, 'listTypes')
        .resolves(['SSCS_DAILY_LIST_ADDITIONAL_HEARINGS', 'CIVIL_DAILY_CAUSE_LIST']);
    const setListTypeSubscriptionStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'setListTypeSubscription');
    setListTypeSubscriptionStub.resolves({});

    it('Remove List type not linked with court', async () => {
        locationStub.withArgs(1).resolves({ jurisdictionType: ['Social Security and Child Support'] });

        await subscriptionService.removeListTypeForCourt('PI_AAD', userId);
        expect(setListTypeSubscriptionStub.calledWith(userId, ['SSCS_DAILY_LIST_ADDITIONAL_HEARINGS']));
    });
});

describe('fulfillSubscriptions', () => {
    const validArtefact = { artefactId: '123' };
    const invalidArtefact = { artefactId: '124' };

    const getMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
    getMetadataStub.withArgs('123', '1').resolves(validArtefact);
    getMetadataStub.withArgs('124', '1').resolves(invalidArtefact);

    const fulfillSubscriptionRequestStub = sinon.stub(SubscriptionRequests.prototype, 'fulfillSubscriptions');
    fulfillSubscriptionRequestStub.withArgs(validArtefact).resolves('Subscriptions fulfilled successfully');
    fulfillSubscriptionRequestStub.withArgs(invalidArtefact).resolves(null);

    it('should return a success message if subscription is deleted', async () => {
        const result = await subscriptionService.fulfillSubscriptions('123', '1');
        expect(result).toEqual('Subscriptions fulfilled successfully');
    });

    it('should return null if subscriptions not fulfilled', async () => {
        const result = await subscriptionService.fulfillSubscriptions('124', '1');
        expect(result).toEqual(null);
    });
});
