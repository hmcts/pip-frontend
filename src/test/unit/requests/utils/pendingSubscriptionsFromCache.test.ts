import sinon from 'sinon';
import { PendingSubscriptionsFromCache } from '../../../../main/service/PendingSubscriptionsFromCache';
import { redisClient } from '../../../../main/cacheManager';

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
const mockListType = ['listType1'];
const mockListLanguage = ['language1'];

const combinedMockCaseWithUrnOnly = [mockCaseWithUrnOnly[0], mockCaseWithUrnOnly2[0]];

const mockCourtJson = JSON.stringify(mockCourt);
const mockCaseJson = JSON.stringify(mockCase);
const mockCaseWithUrnOnlyJson = JSON.stringify(mockCaseWithUrnOnly);
const combinedMockCaseWithUrnOnlyJson = JSON.stringify(combinedMockCaseWithUrnOnly);
const mockListTypeJson = JSON.stringify(mockListType);
const mockListLanguageJson = JSON.stringify(mockListLanguage);

const getStub = sinon.stub(redisClient, 'get');
getStub.withArgs('pending-courts-subscriptions-1').resolves(mockCourtJson);
getStub.withArgs('pending-cases-subscriptions-1').resolves(mockCaseJson);
getStub.withArgs('pending-cases-subscriptions-2').resolves(mockCaseWithUrnOnlyJson);
getStub.withArgs('pending-cases-subscriptions-3').resolves(mockCaseWithUrnOnlyJson);
getStub.withArgs('pending-courts-subscriptions-2').resolves([]);
getStub.withArgs('pending-listTypes-subscriptions-1').resolves(mockListTypeJson);
getStub.withArgs('pending-listLanguage-subscriptions-1').resolves(mockListLanguageJson);

redisClient['status'] = 'ready';

const set = sinon.stub(redisClient, 'set');
const del = sinon.stub(redisClient, 'del');

describe('pendingSubscription from Cache', () => {
    describe('setPendingSubscriptions with valid user', () => {
        it('should set case number into cache', async () => {
            await pendingSubscriptionsFromCache.setPendingSubscriptions(mockCase, 'cases', mockUser.id);
            sinon.assert.calledWith(set, 'pending-cases-subscriptions-1', mockCaseJson);
        });

        it('should set court into cache', async () => {
            await pendingSubscriptionsFromCache.setPendingSubscriptions(mockCourt, 'courts', mockUser.id);
            sinon.assert.calledWith(set, 'pending-courts-subscriptions-1', mockCourtJson);
        });

        it('should set list type into cache', async () => {
            await pendingSubscriptionsFromCache.setPendingSubscriptions(mockListType, 'listTypes', mockUser.id);
            sinon.assert.calledWith(set, 'pending-listTypes-subscriptions-1', mockListTypeJson);
        });

        it('should set list language into cache', async () => {
            await pendingSubscriptionsFromCache.setPendingSubscriptions(mockListLanguage, 'listLanguage', mockUser.id);
            sinon.assert.calledWith(set, 'pending-listLanguage-subscriptions-1', mockListLanguageJson);
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

        it('should get list types from the cache', async () => {
            const cachedResult = await pendingSubscriptionsFromCache.getPendingSubscriptions(mockUser.id, 'listTypes');
            expect(cachedResult).toStrictEqual(mockListType);
        });

        it('should get list language from the cache', async () => {
            const cachedResult = await pendingSubscriptionsFromCache.getPendingSubscriptions(
                mockUser.id,
                'listLanguage'
            );
            expect(cachedResult).toStrictEqual(mockListLanguage);
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

        it('should remove a list type from the cache', async () => {
            await pendingSubscriptionsFromCache.removeFromCache({ 'list-type': 'listType1' }, '1');
            sinon.assert.calledWith(set, 'pending-listTypes-subscriptions-1', '[]');
            sinon.assert.called(getStub);
        });
    });

    describe('removeLocationSubscriptionCache', () => {
        it('should remove a list type and language from the cache', async () => {
            await pendingSubscriptionsFromCache.removeLocationSubscriptionCache('1');
            sinon.assert.calledWith(del, 'pending-listTypes-subscriptions-1');
            sinon.assert.calledWith(del, 'pending-listLanguage-subscriptions-1');
        });
    });

    describe('setListTypeSubscription', () => {
        it('should remove a list type from the cache', async () => {
            await pendingSubscriptionsFromCache.setListTypeSubscription(mockUser.id, mockListType);
            sinon.assert.calledWith(set, 'pending-listTypes-subscriptions-1', mockListTypeJson);
        });
    });
});
