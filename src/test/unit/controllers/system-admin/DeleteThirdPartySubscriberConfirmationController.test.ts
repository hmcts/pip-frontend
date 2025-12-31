import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import DeleteThirdPartySubscriberConfirmationController from '../../../../main/controllers/system-admin/DeleteThirdPartySubscriberConfirmationController';
import { AccountManagementRequests } from '../../../../main/resources/requests/AccountManagementRequests';

const i18n = {
    'delete-third-party-subscriber-confirmation': {
        title: 'Delete third party subscriber confirmation',
    },
};

const userId = '123';
const userIdWithFailedRequest = '124';
const adminUserId = '1';

const thirdPartySubscriber = {
    name: 'thirdPartyName',
};

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;

const request = mockRequest(i18n);

sinon.stub(AccountManagementRequests.prototype, 'getThirdPartySubscriberByUserId').resolves(thirdPartySubscriber);

const deleteSubscriberStub = sinon.stub(AccountManagementRequests.prototype, 'deleteThirdPartySubscriber');
deleteSubscriberStub.withArgs(userId, adminUserId).resolves('success');
deleteSubscriberStub.withArgs(userIdWithFailedRequest, adminUserId).resolves(null);

const deleteThirdPartySubscriberConfirmationController = new DeleteThirdPartySubscriberConfirmationController();

describe('Delete third party subscriber confirmation controller', () => {
    request.user = {
        userId: adminUserId,
        roles: 'SYSTEM_ADMIN',
    };

    describe('GET request', () => {
        request.query = { userId: userId };

        it('should render the delete third party subscriber confirmation page', async () => {
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['delete-third-party-subscriber-confirmation'],
                thirdPartySubscriber,
                userId,
                noOptionError: false,
                failedRequestError: false,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/delete-third-party-subscriber-confirmation', expectedOptions);

            await deleteThirdPartySubscriberConfirmationController.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should render the delete third party subscriber confirmation page with no option error', async () => {
            request.body = { user: userId };
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['delete-third-party-subscriber-confirmation'],
                thirdPartySubscriber,
                userId,
                noOptionError: true,
                failedRequestError: false,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/delete-third-party-subscriber-confirmation', expectedOptions);

            await deleteThirdPartySubscriberConfirmationController.post(request, response);
            responseMock.verify();
        });

        it('should redirect to delete third party subscriber success page', async () => {
            request.body = { user: userId, 'delete-subscriber-confirm': 'yes' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('/delete-third-party-subscriber-success');

            await deleteThirdPartySubscriberConfirmationController.post(request, response);
            responseMock.verify();
        });

        it('should render the delete third party subscriber confirmation page with failed request error', async () => {
            request.body = { user: userIdWithFailedRequest, 'delete-subscriber-confirm': 'yes' };
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['delete-third-party-subscriber-confirmation'],
                thirdPartySubscriber,
                userId: userIdWithFailedRequest,
                noOptionError: false,
                failedRequestError: true,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/delete-third-party-subscriber-confirmation', expectedOptions);

            await deleteThirdPartySubscriberConfirmationController.post(request, response);
            responseMock.verify();
        });

        it('should redirect to manage third party subscriber view page', async () => {
            request.body = { user: userId, 'delete-subscriber-confirm': 'no' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs(`/manage-third-party-subscribers/view?userId=${userId}`);

            await deleteThirdPartySubscriberConfirmationController.post(request, response);
            responseMock.verify();
        });
    });
});
