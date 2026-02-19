import sinon from 'sinon';
import { accountManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { StatusCodes } from 'http-status-codes';
import { ThirdPartyRequests } from '../../../main/resources/requests/ThirdPartyRequests';

const thirdPartyRequests = new ThirdPartyRequests();
const userId = '123';
const requesterId = '456';

const errorResponse = {
    response: {
        data: 'test error',
    },
};
const errorMessage = {
    message: 'test',
};
const mockHeaders = { headers: { 'x-requester-id': '12345' } };
const mockValidThirdPartySubscriberBody = {
    name: 'Joe',
};
const mockThirdPartySubscriptionsBody = [
    {
        userId: userId,
        listType: 'CIVIL_DAILY_CAUSE_LIST',
        sensitivity: 'PUBLIC',
    },
    {
        userId: userId,
        listType: 'FAMILY_DAILY_CAUSE_LIST',
        sensitivity: 'PRIVATE',
    },
];

const thirdPartySubscriberEndpoint = '/third-party';
const thirdPartySubscriptionEndpoint = '/third-party/subscription';
const thirdPartySubscriberOauthConfigEndpoint = '/third-party/configuration';
const thirdPartyHealthCheckEndpoint = `${thirdPartySubscriberOauthConfigEndpoint}/healthcheck`;

let postStub = sinon.stub(accountManagementApi, 'post');
let putStub = sinon.stub(accountManagementApi, 'put');
let getStub = sinon.stub(accountManagementApi, 'get');
let deleteStub = sinon.stub(accountManagementApi, 'delete');

describe('Third-party Requests', () => {
    describe('Create Third Party Subscriber Account', () => {
        it('should return true on success', async () => {
            postStub.withArgs(thirdPartySubscriberEndpoint).resolves({ status: StatusCodes.CREATED });
            const response = await thirdPartyRequests.createThirdPartySubscriber(
                mockValidThirdPartySubscriberBody,
                mockHeaders
            );
            expect(response).toStrictEqual(true);
        });

        it('should return null on error response', async () => {
            postStub.withArgs(thirdPartySubscriberEndpoint).resolves(Promise.reject(errorResponse));
            const response = await thirdPartyRequests.createThirdPartySubscriber({ foo: 'blah' }, mockHeaders);
            expect(response).toBe(null);
        });

        it('should return null on error message', async () => {
            postStub.withArgs(thirdPartySubscriberEndpoint).resolves(Promise.reject(errorMessage));
            const response = await thirdPartyRequests.createThirdPartySubscriber({ bar: 'baz' }, mockHeaders);
            expect(response).toBe(null);
        });
    });

    describe('Get third party subscriber by id', () => {
        const idtoUse = '123';

        beforeEach(() => {
            sinon.restore();
            getStub = sinon.stub(accountManagementApi, 'get');
        });

        it('should return pi user on success', async () => {
            getStub.withArgs(`${thirdPartySubscriberEndpoint}/${idtoUse}`).resolves({
                status: 200,
                data: { userId: '321', name: 'name' },
            });
            const response = await thirdPartyRequests.getThirdPartySubscriberByUserId(idtoUse, '1234');
            expect(response).toStrictEqual({
                userId: '321',
                name: 'name',
            });
        });

        it('should return null on error response', async () => {
            getStub.withArgs(`${thirdPartySubscriberEndpoint}/${idtoUse}`).rejects(errorResponse);
            const response = await thirdPartyRequests.getThirdPartySubscriberByUserId(idtoUse, '1234');
            expect(response).toBe(null);
        });

        it('should return null on error message', async () => {
            getStub.withArgs(`${thirdPartySubscriberEndpoint}/${idtoUse}`).rejects(errorMessage);
            const response = await thirdPartyRequests.getThirdPartySubscriberByUserId(idtoUse, '1234');
            expect(response).toBe(null);
        });
    });

    describe('Delete third party subscriber id', () => {
        const idtoUse = '123';
        const adminUserId = '456';

        beforeEach(() => {
            sinon.restore();
            deleteStub = sinon.stub(accountManagementApi, 'delete');
        });

        it('should return string on deletion success', async () => {
            deleteStub
                .withArgs(`${thirdPartySubscriberEndpoint}/${idtoUse}`, {
                    headers: { 'x-requester-id': adminUserId },
                })
                .resolves({ status: 200, data: 'Deleted' });
            const response = await thirdPartyRequests.deleteThirdPartySubscriber(idtoUse, adminUserId);
            expect(response).toStrictEqual('Deleted');
        });

        it('should return null on error response', async () => {
            deleteStub.withArgs(`${thirdPartySubscriberEndpoint}/${idtoUse}`).rejects(errorResponse);
            const response = await thirdPartyRequests.deleteThirdPartySubscriber(idtoUse, adminUserId);
            expect(response).toBe(null);
        });

        it('should return null on error message', async () => {
            deleteStub.withArgs(`${thirdPartySubscriberEndpoint}/${idtoUse}`).rejects(errorMessage);
            const response = await thirdPartyRequests.deleteThirdPartySubscriber(idtoUse, adminUserId);
            expect(response).toBe(null);
        });
    });

    describe('Get third party subscriber accounts', () => {
        const adminUserId = '1234-1234';

        beforeEach(() => {
            sinon.restore();
            getStub = sinon.stub(accountManagementApi, 'get');
        });

        it('should return third party accounts', async () => {
            const thirdPartySubscribers = [{ userId: '1234-1234' }, { userId: '2345-2345' }];

            getStub.withArgs(thirdPartySubscriberEndpoint).resolves({ status: 200, data: thirdPartySubscribers });

            const response = await thirdPartyRequests.getThirdPartySubscribers(adminUserId);
            expect(response).toBe(thirdPartySubscribers);
        });

        it('should return false on error response', async () => {
            getStub.withArgs(thirdPartySubscriberEndpoint).rejects(errorResponse);
            const response = await thirdPartyRequests.getThirdPartySubscribers(adminUserId);
            expect(response).toBe(null);
        });

        it('should return false on error message', async () => {
            getStub.withArgs(thirdPartySubscriberEndpoint).rejects(errorMessage);
            const response = await thirdPartyRequests.getThirdPartySubscribers(adminUserId);
            expect(response).toBe(null);
        });
    });

    describe('Create third party subscriptions', () => {
        beforeEach(() => {
            sinon.restore();
            postStub = sinon.stub(accountManagementApi, 'post');
        });

        it('should return true on success', async () => {
            postStub.withArgs(thirdPartySubscriptionEndpoint).resolves({ status: StatusCodes.CREATED });
            const response = await thirdPartyRequests.createThirdPartySubscriptions(
                mockThirdPartySubscriptionsBody,
                requesterId
            );
            expect(response).toBeTruthy();
        });

        it('should return false on error response', async () => {
            postStub.withArgs(thirdPartySubscriptionEndpoint).resolves(Promise.reject(errorResponse));
            const response = await thirdPartyRequests.createThirdPartySubscriptions(
                mockThirdPartySubscriptionsBody,
                requesterId
            );
            expect(response).toBeFalsy();
        });

        it('should return false on error message', async () => {
            postStub.withArgs(thirdPartySubscriptionEndpoint).resolves(Promise.reject(errorMessage));
            const response = await thirdPartyRequests.createThirdPartySubscriptions(
                mockThirdPartySubscriptionsBody,
                requesterId
            );
            expect(response).toBeFalsy();
        });
    });

    describe('Update third party subscriptions', () => {
        beforeEach(() => {
            sinon.restore();
            putStub = sinon.stub(accountManagementApi, 'put');
        });

        it('should return true on success', async () => {
            putStub.withArgs(`${thirdPartySubscriptionEndpoint}/${userId}`).resolves({ status: StatusCodes.OK });
            const response = await thirdPartyRequests.updateThirdPartySubscriptions(
                mockThirdPartySubscriptionsBody,
                userId,
                requesterId
            );
            expect(response).toBeTruthy();
        });

        it('should return false on error response', async () => {
            putStub.withArgs(`${thirdPartySubscriptionEndpoint}/${userId}`).resolves(Promise.reject(errorResponse));
            const response = await thirdPartyRequests.updateThirdPartySubscriptions(
                mockThirdPartySubscriptionsBody,
                userId,
                requesterId
            );
            expect(response).toBeFalsy();
        });

        it('should return false on error message', async () => {
            putStub.withArgs(`${thirdPartySubscriptionEndpoint}/${userId}`).resolves(Promise.reject(errorMessage));
            const response = await thirdPartyRequests.updateThirdPartySubscriptions(
                mockThirdPartySubscriptionsBody,
                userId,
                requesterId
            );
            expect(response).toBeFalsy();
        });
    });

    describe('Get third party subscriptions by user ID', () => {
        beforeEach(() => {
            sinon.restore();
            getStub = sinon.stub(accountManagementApi, 'get');
        });

        it('should return third-party subscriptions on success', async () => {
            getStub
                .withArgs(`${thirdPartySubscriptionEndpoint}/${userId}`)
                .resolves({ status: 200, data: mockThirdPartySubscriptionsBody });

            const response = await thirdPartyRequests.getThirdPartySubscriptionsByUserId(userId, requesterId);
            expect(response).toStrictEqual(mockThirdPartySubscriptionsBody);
        });

        it('should return null on error response', async () => {
            getStub.withArgs(`${thirdPartySubscriptionEndpoint}/${userId}`).rejects(errorResponse);
            const response = await thirdPartyRequests.getThirdPartySubscriptionsByUserId(userId, requesterId);
            expect(response).toBe(null);
        });

        it('should return null on error message', async () => {
            getStub.withArgs(`${thirdPartySubscriptionEndpoint}/${userId}`).rejects(errorMessage);
            const response = await thirdPartyRequests.getThirdPartySubscriptionsByUserId(userId, requesterId);
            expect(response).toBe(null);
        });
    });

    describe('Get third party subscriber oauth config by id', () => {
        const idtoUse = '123';

        beforeEach(() => {
            sinon.restore();
            getStub = sinon.stub(accountManagementApi, 'get');
        });

        it('should return third party subscriber oauth config on success', async () => {
            getStub.withArgs(`${thirdPartySubscriberOauthConfigEndpoint}/${idtoUse}`).resolves({
                status: 200,
                data: { userId: '321', destinationUrl: 'url' },
            });
            const response = await thirdPartyRequests.getThirdPartySubscriberOauthConfigByUserId(idtoUse, '1234');
            expect(response).toStrictEqual({
                userId: '321',
                destinationUrl: 'url',
            });
        });

        it('should return null on error response', async () => {
            getStub.withArgs(`${thirdPartySubscriberOauthConfigEndpoint}/${idtoUse}`).rejects(errorResponse);
            const response = await thirdPartyRequests.getThirdPartySubscriberOauthConfigByUserId(idtoUse, '1234');
            expect(response).toBe(null);
        });

        it('should return null on error message', async () => {
            getStub.withArgs(`${thirdPartySubscriberOauthConfigEndpoint}/${idtoUse}`).rejects(errorMessage);
            const response = await thirdPartyRequests.getThirdPartySubscriberOauthConfigByUserId(idtoUse, '1234');
            expect(response).toBe(null);
        });
    });

    describe('Create Third Party Subscriber Oauth Config', () => {
        beforeEach(() => {
            sinon.restore();
            postStub = sinon.stub(accountManagementApi, 'post');
        });

        it('should return true on success', async () => {
            postStub.withArgs(thirdPartySubscriberOauthConfigEndpoint).resolves({ status: StatusCodes.CREATED });
            const response = await thirdPartyRequests.createThirdPartySubscriberOauthConfig(
                mockValidThirdPartySubscriberBody,
                mockHeaders
            );
            expect(response).toStrictEqual(true);
        });

        it('should return null on error response', async () => {
            postStub.withArgs(thirdPartySubscriberOauthConfigEndpoint).resolves(Promise.reject(errorResponse));
            const response = await thirdPartyRequests.createThirdPartySubscriberOauthConfig(
                { foo: 'blah' },
                mockHeaders
            );
            expect(response).toBe(null);
        });

        it('should return null on error message', async () => {
            postStub.withArgs(thirdPartySubscriberOauthConfigEndpoint).resolves(Promise.reject(errorMessage));
            const response = await thirdPartyRequests.createThirdPartySubscriberOauthConfig(
                { bar: 'baz' },
                mockHeaders
            );
            expect(response).toBe(null);
        });
    });

    describe('Update third party subscriber oauth config by id', () => {
        const idtoUse = '123';
        const updateOauthConfigPayload = {
            userId: '321',
            destinationUrl: 'url',
        };
        beforeEach(() => {
            sinon.restore();
            putStub = sinon.stub(accountManagementApi, 'put');
        });

        it('should update third party subscriber oauth config on success', async () => {
            putStub.withArgs(`${thirdPartySubscriberOauthConfigEndpoint}/${idtoUse}`).resolves({
                status: 200,
                data: { userId: '321', destinationUrl: 'url' },
            });
            const response = await thirdPartyRequests.updateThirdPartySubscriberOauthConfig(
                idtoUse,
                updateOauthConfigPayload,
                '1234'
            );
            expect(response).toStrictEqual(true);
        });

        it('should return null on error response', async () => {
            putStub.withArgs(`${thirdPartySubscriberOauthConfigEndpoint}/${idtoUse}`).rejects(errorResponse);
            const response = await thirdPartyRequests.updateThirdPartySubscriberOauthConfig(
                idtoUse,
                updateOauthConfigPayload,
                '1234'
            );
            expect(response).toBe(null);
        });

        it('should return null on error message', async () => {
            putStub.withArgs(`${thirdPartySubscriberOauthConfigEndpoint}/${idtoUse}`).rejects(errorMessage);
            const response = await thirdPartyRequests.updateThirdPartySubscriberOauthConfig(
                idtoUse,
                updateOauthConfigPayload,
                '1234'
            );
            expect(response).toBe(null);
        });
    });

    describe('Third-party config health check', () => {
        const idtoUse = '123';

        beforeEach(() => {
            sinon.restore();
            getStub = sinon.stub(accountManagementApi, 'get');
        });

        it('should return true on successful health check', async () => {
            getStub.withArgs(`${thirdPartyHealthCheckEndpoint}/${idtoUse}`).resolves({
                status: 200,
                data: 'Successfully performed healthcheck on third-party user',
            });
            const response = await thirdPartyRequests.thirdPartyConfigurationHealthCheck(idtoUse, '1234');
            expect(response).toBeTruthy();
        });

        it('should return false on error message', async () => {
            getStub.withArgs(`${thirdPartyHealthCheckEndpoint}/${idtoUse}`).rejects(errorMessage);
            const response = await thirdPartyRequests.thirdPartyConfigurationHealthCheck(idtoUse, '1234');
            expect(response).toBeFalsy();
        });

        it('should return error message on 500 error response', async () => {
            const responseMessage = 'Internal server error';
            const errorResponse = {
                response: {
                    status: 500,
                    data: {
                        message: responseMessage,
                        timestamp: '2026-01-01T00:00:00Z',
                    },
                },
            };

            getStub.withArgs(`${thirdPartyHealthCheckEndpoint}/${idtoUse}`).rejects(errorResponse);
            const response = await thirdPartyRequests.thirdPartyConfigurationHealthCheck(idtoUse, '1234');
            expect(response).toStrictEqual(responseMessage)
        });
    });
});
