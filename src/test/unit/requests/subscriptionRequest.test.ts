import { SubscriptionRequests } from '../../../main/resources/requests/SubscriptionRequests';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { accountManagementApi } from '../../../main/resources/requests/utils/axiosConfig';

const userIdWithSubscriptions = '1';
const userIdWithoutSubscriptions = '2';
const nonExistingUserId = '777';
const subscriptionActions = new SubscriptionRequests();
const mockedCaseSubscription = 'D123123';
const mockedCourtSubscription = {
    name: 'Manchester Crown Court',
    dateAdded: '2022-01-14T11:42:57.847708',
};

const errorResponse = {
    response: {
        data: 'test error',
    },
};

const errorMessage = {
    message: 'test',
};

const unsubscribeValidData = {
    subscriptionId: '123',
};
const unsubscribeInvalidData = {
    subscriptionId: 'foo',
};
const deletionResponse = 'success';
const adminUserId = '1234';
const errorBodyData = { baz: 'qux' };
const rawData2 = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionsData2 = JSON.parse(rawData2);
const getStub = sinon.stub(accountManagementApi, 'get');
const postStub = sinon.stub(accountManagementApi, 'post');
const putStub = sinon.stub(accountManagementApi, 'put');
const deleteStub = sinon.stub(accountManagementApi, 'delete');

describe(`getUserSubscriptions(${userIdWithSubscriptions}) with valid user id`, () => {
    getStub.withArgs(`/subscription/user/${userIdWithSubscriptions}`).resolves(subscriptionsData2);

    it('should return user subscription object', async () => {
        const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions);
        expect(userSubscriptions.caseSubscriptions.length).toEqual(6);
        expect(userSubscriptions.locationSubscriptions.length).toEqual(3);
    });

    it('should have mocked object in the case subscriptions list', async () => {
        const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions);
        expect(userSubscriptions.caseSubscriptions[0].caseNumber).toBe(mockedCaseSubscription);
    });

    it('should have mocked object in the court subscriptions list', async () => {
        const userSubscriptions = await subscriptionActions.getUserSubscriptions(userIdWithSubscriptions);
        expect(userSubscriptions.locationSubscriptions[0].locationName).toBe(mockedCourtSubscription.name);
    });
});

describe('getUserSubscriptions error tests', () => {
    beforeEach(() => {
        getStub.withArgs(`/subscription/user/${userIdWithoutSubscriptions}`).resolves({ data: [] });
        getStub.withArgs(`/subscription/user/${nonExistingUserId}`).resolves({
            data: { caseSubscriptions: [], courtSubscriptions: [] },
        });
        getStub.withArgs('/subscription/user/999').rejects(errorMessage);
        getStub.withArgs('/subscription/user/9999').rejects(errorResponse);
    });

    it('should return null for error response', async () => {
        const userSubscriptions = await subscriptionActions.getUserSubscriptions('99');
        expect(userSubscriptions).toBe(null);
    });

    it('should return empty list of subscriptions', async () => {
        const userSubscriptions = await subscriptionActions.getUserSubscriptions(nonExistingUserId);
        expect(userSubscriptions.caseSubscriptions.length).toBe(0);
    });

    it('should return null for error message', async () => {
        const userSubscriptions = await subscriptionActions.getUserSubscriptions('999');
        expect(userSubscriptions).toBe(null);
    });

    it('should return null for error response', async () => {
        const userSubscriptions = await subscriptionActions.getUserSubscriptions('9999');
        expect(userSubscriptions).toBe(null);
    });
});

describe('subscribe', () => {
    const userId = '1234-1234';

    it('should return true if call is successful', async () => {
        postStub.withArgs('/subscription').resolves({});
        const userSubscriptions = await subscriptionActions.subscribe({}, userId);
        expect(userSubscriptions).toBe(true);
    });

    it('should return false for failure', async () => {
        postStub.withArgs('/subscription').rejects(errorMessage);
        const userSubscriptions = await subscriptionActions.subscribe({}, userId);
        expect(userSubscriptions).toBe(false);
    });

    it('should return false for error response', async () => {
        postStub.withArgs('/subscription').rejects(errorResponse);
        const userSubscriptions = await subscriptionActions.subscribe({}, userId);
        expect(userSubscriptions).toBe(false);
    });
});

describe('unsubscribe with valid post data', () => {
    deleteStub.withArgs('/subscription/123').resolves({ data: 'unsubscribed successfully' });
    it('should return true if provided data is valid', async () => {
        const unsubscribe = await subscriptionActions.unsubscribe(unsubscribeValidData.subscriptionId, '1234-1234');
        expect(unsubscribe).toBe('unsubscribed successfully');
    });
});

describe('unsubscribe error states', () => {
    describe('unsubscribe error response', () => {
        deleteStub.withArgs(`/subscription/${unsubscribeInvalidData.subscriptionId}`).rejects(errorResponse);
        it('should return null', async () => {
            const unsubscribe = await subscriptionActions.unsubscribe(
                unsubscribeInvalidData.subscriptionId,
                '2345-2345'
            );
            expect(unsubscribe).toBe(null);
        });
    });

    describe('unsubscribe error', () => {
        deleteStub.withArgs(`/subscription/${errorBodyData.baz}`).rejects({ error: 'error' });
        it('should return null', async () => {
            const unsubscribe = await subscriptionActions.unsubscribe(errorBodyData.baz, '4567-4567');
            expect(unsubscribe).toBe(null);
        });
    });
});

describe('bulkDeleteSubscriptions', () => {
    const subscriptions = ['123'];
    const userId = '456';

    it('should return success message if call is successful', async () => {
        deleteStub.withArgs('/subscription/bulk').resolves({ data: 'unsubscribed successfully' });
        const response = await subscriptionActions.bulkDeleteSubscriptions(subscriptions, userId);
        expect(response).toBe('unsubscribed successfully');
    });

    it('should return nothing for error response', async () => {
        deleteStub.withArgs('/subscription/bulk').rejects(errorResponse);
        const response = await subscriptionActions.bulkDeleteSubscriptions(subscriptions, userId);
        expect(response).toBe(null);
    });

    it('should return nothing for other error', async () => {
        deleteStub.withArgs('/subscription/bulk').rejects(errorMessage);
        const response = await subscriptionActions.bulkDeleteSubscriptions(subscriptions, userId);
        expect(response).toBe(null);
    });
});

describe('add list type Location subscriptions for a user', () => {
    it('should return true if call is successful', async () => {
        postStub.withArgs('/subscription/add-list-types').resolves({});
        const subscriptionAdded = await subscriptionActions.addListTypeForLocationSubscriptions('1', {});
        expect(subscriptionAdded).toBe(true);
    });

    it('should return false for failure', async () => {
        postStub.withArgs('/subscription/add-list-types/null').rejects(errorMessage);
        const subscriptionAdded = await subscriptionActions.addListTypeForLocationSubscriptions(null, {});
        expect(subscriptionAdded).toBe(false);
    });

    it('should return false for error response', async () => {
        postStub.withArgs('/subscription/add-list-types/null').rejects(errorResponse);
        const subscriptionAdded = await subscriptionActions.addListTypeForLocationSubscriptions(null, {});
        expect(subscriptionAdded).toBe(false);
    });
});

describe('configure list type Location subscriptions for a user', () => {
    it('should return true if call is successful', async () => {
        putStub.withArgs('/subscription/configure-list-types').resolves({});
        const subscriptionUpdated = await subscriptionActions.configureListTypeForLocationSubscriptions('1', {});
        expect(subscriptionUpdated).toBe(true);
    });

    it('should return false for failure', async () => {
        putStub.withArgs('/subscription/configure-list-types/null').rejects(errorMessage);
        const subscriptionUpdated = await subscriptionActions.configureListTypeForLocationSubscriptions(null, {});
        expect(subscriptionUpdated).toBe(false);
    });

    it('should return false for error response', async () => {
        putStub.withArgs('/subscription/configure-list-types/null').rejects(errorResponse);
        const subscriptionUpdated = await subscriptionActions.configureListTypeForLocationSubscriptions(null, {});
        expect(subscriptionUpdated).toBe(false);
    });
});

describe('retrieve subscription channels', () => {
    it('should return channels if call is successful', async () => {
        getStub.withArgs('/subscription/channel').resolves({ data: ['CHANNEL_A', 'CHANNEL_B'] });
        const channels = await subscriptionActions.retrieveSubscriptionChannels();
        expect(channels).toStrictEqual(['CHANNEL_A', 'CHANNEL_B']);
    });

    it('should return empty array for failure', async () => {
        getStub.withArgs('/subscription/channel').rejects(errorMessage);
        const channels = await subscriptionActions.retrieveSubscriptionChannels();
        expect(channels).toStrictEqual([]);
    });

    it('should return false for error response', async () => {
        getStub.withArgs('/subscription/channel').rejects(errorResponse);
        const channels = await subscriptionActions.retrieveSubscriptionChannels();
        expect(channels).toStrictEqual([]);
    });
});

describe('delete location subscription', () => {
    beforeEach(() => {
        deleteStub
            .withArgs('/subscription/location/1', {
                headers: { 'x-user-id': adminUserId },
            })
            .resolves({ data: 'success' });
        deleteStub
            .withArgs('/subscription/location/2', {
                headers: { 'x-user-id': adminUserId },
            })
            .rejects(errorResponse);
        deleteStub
            .withArgs('/subscription/location/4', {
                headers: { 'x-user-id': adminUserId },
            })
            .rejects(errorMessage);
    });
    it('should delete the court subscription', async () => {
        expect(await subscriptionActions.deleteLocationSubscription(1, adminUserId)).toStrictEqual(deletionResponse);
    });

    it('should return null if response fails', async () => {
        expect(await subscriptionActions.deleteLocationSubscription(2, adminUserId)).toBe(null);
    });

    it('should return null if request fails', async () => {
        expect(await subscriptionActions.deleteLocationSubscription(3, adminUserId)).toBe(null);
    });

    it('should return null if request fails', async () => {
        expect(await subscriptionActions.deleteLocationSubscription(4, adminUserId)).toBe(null);
    });
});

describe('fulfill subscriptions', () => {
    it('should return success message if call is successful', async () => {
        postStub.withArgs('/subscription/artefact-recipients').resolves({ data: 'success' });
        const data = await subscriptionActions.fulfillSubscriptions({});
        expect(data).toBe('success');
    });

    it('should return null for failure', async () => {
        postStub.withArgs('/subscription/artefact-recipients').rejects(errorMessage);
        const subscriptionUpdated = await subscriptionActions.fulfillSubscriptions({});
        expect(subscriptionUpdated).toBe(null);
    });

    it('should return null for error response', async () => {
        postStub.withArgs('/subscription/artefact-recipients').rejects(errorResponse);
        const subscriptionUpdated = await subscriptionActions.fulfillSubscriptions({});
        expect(subscriptionUpdated).toBe(null);
    });
});
