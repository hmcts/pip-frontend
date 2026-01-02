import sinon from 'sinon';
import { accountManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { StatusCodes } from 'http-status-codes';
import { ThirdPartyRequests } from '../../../main/resources/requests/ThirdPartyRequests';

const thirdPartyRequests = new ThirdPartyRequests();
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

const thirdPartySubscriberEndpoint = '/third-party';

let postStub = sinon.stub(accountManagementApi, 'post');
let getStub = sinon.stub(accountManagementApi, 'get');
let deleteStub = sinon.stub(accountManagementApi, 'delete');

describe('Account Management Requests', () => {

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
});
