import sinon from 'sinon';
import { PendingSubscriptionsFromCache } from '../../../../main/resources/requests/utils/pendingSubscriptionsFromCache';
const { redisClient } = require('../../../../main/cacheManager');

const mockUser = {
    id: '1',
};
const pendingSubscriptionsFromCache = new PendingSubscriptionsFromCache();
const mockCourt = [
    {
        locationId: 643,
        name: 'Aberdeen Tribunal Hearing Centre',
        jurisdiction: 'Tribunal',
        location: 'Scotland',
        hearingList: [],
        hearings: 0,
    },
];
const mockCase = [
    {
        caseNumber: 'CASENUMBER1234',
        caseName: 'Case Name',
        caseUrn: 'CASEURN12345',
    },
];
const mockCaseWithUrnOnly = [
    {
        caseNumber: null,
        caseName: null,
        caseUrn: 'CASEURN1234',
        urnSearch: true,
    },
];
const mockCaseWithUrnOnly2 = [
    {
        caseNumber: null,
        caseName: null,
        caseUrn: 'ABC',
        urnSearch: true,
    },
];
const combinedMockCaseWithUrnOnly = [mockCaseWithUrnOnly[0], mockCaseWithUrnOnly2[0]];

const mockCourtJson = JSON.stringify(mockCourt);
const mockCaseJson = JSON.stringify(mockCase);
const mockCaseWithUrnOnlyJson = JSON.stringify(mockCaseWithUrnOnly);
const combinedMockCaseWithUrnOnlyJson = JSON.stringify(combinedMockCaseWithUrnOnly);

const getStub = sinon.stub(redisClient, 'get');
getStub.withArgs('pending-courts-subscriptions-1').resolves(mockCourtJson);
getStub.withArgs('pending-cases-subscriptions-1').resolves(mockCaseJson);
getStub.withArgs('pending-cases-subscriptions-2').resolves(mockCaseWithUrnOnlyJson);
getStub.withArgs('pending-cases-subscriptions-3').resolves(mockCaseWithUrnOnlyJson);
getStub.withArgs('pending-courts-subscriptions-2').resolves([]);
sinon.stub(redisClient, 'status').value('ready');
const set = sinon.stub(redisClient, 'set');

describe('setPendingSubscriptions with valid user', () => {
    it('should set case number into cache', async () => {
        await pendingSubscriptionsFromCache.setPendingSubscriptions(mockCase, 'cases', mockUser.id);
        sinon.assert.calledWith(set, 'pending-cases-subscriptions-1', mockCaseJson);
    });

    it('should set court into cache', async () => {
        await pendingSubscriptionsFromCache.setPendingSubscriptions(mockCourt, 'courts', mockUser.id);
        sinon.assert.calledWith(set, 'pending-courts-subscriptions-1', mockCourtJson);
    });

    it('should set case URN into cache', async () => {
        await pendingSubscriptionsFromCache.setPendingSubscriptions(mockCaseWithUrnOnly, 'cases', '2');
        sinon.assert.calledWith(set, 'pending-cases-subscriptions-2', mockCaseWithUrnOnlyJson);
    });

    it('should set case URN into cache if not currently exist on cache', async () => {
        await pendingSubscriptionsFromCache.setPendingSubscriptions(mockCaseWithUrnOnly2, 'cases', '3');
        sinon.assert.calledWith(set, 'pending-cases-subscriptions-3', combinedMockCaseWithUrnOnlyJson);
    });
});

describe('getPendingSubscriptions', () => {
    it('should get cases list from the cache', async () => {
        const cachedResult = await pendingSubscriptionsFromCache.getPendingSubscriptions(mockUser.id, 'cases');
        expect(cachedResult).toStrictEqual(mockCase);
    });

    it('should get courts list from the cache', async () => {
        const cachedResult = await pendingSubscriptionsFromCache.getPendingSubscriptions(mockUser.id, 'courts');
        expect(cachedResult).toStrictEqual(mockCourt);
    });
});

describe('removeFromCache', () => {
    it('should remove a court record from the cache', async () => {
        await pendingSubscriptionsFromCache.removeFromCache({ court: '643' }, '1');
        sinon.assert.calledWith(set, 'pending-courts-subscriptions-1', '[]');
        sinon.assert.called(getStub);
    });

    it('should remove a case number record from the cache', async () => {
        await pendingSubscriptionsFromCache.removeFromCache({ 'case-number': 'CASENUMBER1234' }, '1');
        sinon.assert.calledWith(set, 'pending-cases-subscriptions-1', '[]');
        sinon.assert.called(getStub);
    });

    it('should remove a case URN record from the cache', async () => {
        await pendingSubscriptionsFromCache.removeFromCache({ 'case-urn': 'CASEURN1234' }, '2');
        sinon.assert.calledWith(set, 'pending-cases-subscriptions-2', '[]');
        sinon.assert.called(getStub);
    });
});
