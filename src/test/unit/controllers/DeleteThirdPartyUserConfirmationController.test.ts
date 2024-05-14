import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import DeleteThirdPartyUserConfirmationController
    from "../../../main/controllers/DeleteThirdPartyUserConfirmationController";
import {AccountManagementRequests} from "../../../main/resources/requests/AccountManagementRequests";

const i18n = {
    'delete-third-party-user-confirmation': {
        title: 'Delete third party user confirmation',
    },
};

const userId = '123';
const userIdWithFailedRequest = '124';
const adminUserId = '1';

const thirdPartyUser = {
    userProvenance: 'THIRD_PARTY',
    provenanceUserId: 'thirdPartyName',
    roles: 'GENERAL_THIRD_PARTY',
}

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;

const request = mockRequest(i18n);

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves(thirdPartyUser);

const deleteUserStub = sinon.stub(AccountManagementRequests.prototype, 'deleteUser');
deleteUserStub.withArgs(userId, adminUserId).resolves('success');
deleteUserStub.withArgs(userIdWithFailedRequest, adminUserId).resolves(null);

const deleteThirdPartyUserConfirmationController = new DeleteThirdPartyUserConfirmationController();

describe('Delete third party user confirmation controller', () => {
    request.user = {
        userId: adminUserId,
        roles: 'SYSTEM_ADMIN',
    };

    describe('GET request', () => {
        request.query = { userId: userId };

        it('should render the delete third party user confirmation page', async () => {
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['delete-third-party-user-confirmation'],
                thirdPartyUser,
                userId,
                noOptionError: false,
                failedRequestError: false,
            };


            responseMock.expects('render').once().withArgs('delete-third-party-user-confirmation', expectedOptions);

            await deleteThirdPartyUserConfirmationController.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should render the delete third party user confirmation page with no option error', async () => {
            request.body = { user: userId };
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['delete-third-party-user-confirmation'],
                thirdPartyUser,
                userId,
                noOptionError: true,
                failedRequestError: false,
            };

            responseMock.expects('render').once().withArgs('delete-third-party-user-confirmation', expectedOptions);

            await deleteThirdPartyUserConfirmationController.post(request, response);
            responseMock.verify();
        });

        it('should redirect to delete third party user success page', async () => {
            request.body = { user: userId, 'delete-user-confirm': 'yes' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('/delete-third-party-user-success');

            await deleteThirdPartyUserConfirmationController.post(request, response);
            responseMock.verify();

        });

        it('should render the delete third party user confirmation page with failed request error', async () => {
            request.body = { user: userIdWithFailedRequest, 'delete-user-confirm': 'yes' };
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['delete-third-party-user-confirmation'],
                thirdPartyUser,
                userId: userIdWithFailedRequest,
                noOptionError: false,
                failedRequestError: true,
            };

            responseMock.expects('render').once().withArgs('delete-third-party-user-confirmation', expectedOptions);

            await deleteThirdPartyUserConfirmationController.post(request, response);
            responseMock.verify();

        });

        it('should redirect to manage third party user view page', async () => {
            request.body = { user: userId, 'delete-user-confirm': 'no' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs(`/manage-third-party-users/view?userId=${userId}`);

            await deleteThirdPartyUserConfirmationController.post(request, response);
            responseMock.verify();

        });
    });
});
