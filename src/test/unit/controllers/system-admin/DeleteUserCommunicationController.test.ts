import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import DeleteUserCommunicationController from '../../../../main/controllers/system-admin/DeleteUserCommunicationController';
import { UserCommunicationManagementService } from '../../../../main/service/UserCommunicationManagementService';
import { UserManagementService } from '../../../../main/service/UserManagementService';

const deleteUserCommunicationController = new DeleteUserCommunicationController();

const i18n = {
    'delete-user-communication': {
        title: 'Delete Confirmation',
    },
    error: {
        title: 'Error',
    },
};

describe('Delete user communication controller', () => {
    let request;
    let response;

    beforeEach(() => {
        request = mockRequest(i18n);
        request.user = { userId: '123' };
        response = {
            render: () => {
                return '';
            },
            redirect: () => {
                return '';
            },
        } as unknown as Response;
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('get', () => {
        it('should render the delete user communication confirmation page', async () => {
            request.query = { id: '123' };
            const responseMock = sinon.mock(response);

            const formData = { bannerMessage: 'test', typeOfCommunication: 'ALL_USERS' };
            sinon.stub(UserCommunicationManagementService.prototype, 'getFormDataById').resolves(formData);
            sinon.stub(UserCommunicationManagementService.prototype, 'getTableHeaders').returns(['header1']);
            sinon.stub(UserCommunicationManagementService.prototype, 'fetchUserCommunicationSummary').returns([['data1']]);

            responseMock.expects('render').once().withArgs('system-admin/delete-user-communication', sinon.match.any);

            await deleteUserCommunicationController.get(request, response);
            responseMock.verify();
        });

        it('should render error page if communication not found', async () => {
            request.query = { id: 'invalid' };
            const responseMock = sinon.mock(response);

            sinon.stub(UserCommunicationManagementService.prototype, 'getFormDataById').resolves({});

            responseMock.expects('render').once().withArgs('error', i18n.error);

            await deleteUserCommunicationController.get(request, response);
            responseMock.verify();
        });
    });

    describe('post', () => {
        const formData = { bannerMessage: 'test', typeOfCommunication: 'ALL_USERS' };

        beforeEach(() => {
            sinon.stub(UserCommunicationManagementService.prototype, 'getFormDataById').resolves(formData);
            sinon.stub(UserCommunicationManagementService.prototype, 'getTableHeaders').returns(['header1']);
            sinon.stub(UserCommunicationManagementService.prototype, 'fetchUserCommunicationSummary').returns([['data1']]);
        });

        it('should redirect to success page when "yes" is selected', async () => {
            request.body = { 'delete-choice': 'yes', userCommunicationId: '123' };
            const responseMock = sinon.mock(response);

            sinon.stub(UserCommunicationManagementService.prototype, 'deleteUserCommunication').resolves(true);
            sinon.stub(UserManagementService.prototype, 'auditAction').resolves();

            responseMock.expects('redirect').once().withArgs('/delete-user-communication-success');

            await deleteUserCommunicationController.post(request, response);
            responseMock.verify();
        });

        it('should redirect to management page when "no" is selected', async () => {
            request.body = { 'delete-choice': 'no', userCommunicationId: '123' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('/user-communication-management');

            await deleteUserCommunicationController.post(request, response);
            responseMock.verify();
        });

        it('should render confirmation page with error if delete fails', async () => {
            request.body = { 'delete-choice': 'yes', userCommunicationId: '123' };
            const responseMock = sinon.mock(response);

            sinon.stub(UserCommunicationManagementService.prototype, 'deleteUserCommunication').resolves(false);

            responseMock.expects('render').once().withArgs('system-admin/delete-user-communication', sinon.match.has('displayError', true));

            await deleteUserCommunicationController.post(request, response);
            responseMock.verify();
        });

        it('should render confirmation page with error if no choice is made', async () => {
            request.body = { userCommunicationId: '123' };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('system-admin/delete-user-communication', sinon.match.has('displayError', true));

            await deleteUserCommunicationController.post(request, response);
            responseMock.verify();
        });

        it('should render error page if userCommunicationId is missing', async () => {
            request.body = { 'delete-choice': 'yes' };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', i18n.error);

            await deleteUserCommunicationController.post(request, response);
            responseMock.verify();
        });
    });
});
