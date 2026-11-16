import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import DeleteUserConfirmationController from '../../../../main/controllers/system-admin/DeleteUserConfirmationController';
import { AccountManagementRequests } from '../../../../main/resources/requests/AccountManagementRequests';
import { v4 as uuidv4 } from 'uuid';

const validId1 = uuidv4();
const validId2 = uuidv4();

const i18n = {
    'delete-user-confirmation': {},
    error: {},
};

const userData = {
    email: 'test@email.com',
    roles: 'SYSTEM_ADMIN',
};

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves(userData);
const deleteUserStub = sinon.stub(AccountManagementRequests.prototype, 'deleteUser');
deleteUserStub.withArgs(validId1).resolves(true);
deleteUserStub.withArgs(validId2).resolves(undefined);

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;

const deleteUserConfirmationController = new DeleteUserConfirmationController();

describe('Delete User Confirmation Controller', () => {
    describe('GET request', () => {
        const request = mockRequest(i18n);

        it('should render the delete user page', async () => {
            request.query = { id: validId1 };

            const responseMock = sinon.mock(response);
            const expectedData = {
                ...i18n['delete-user-confirmation'],
                userData,
            };

            responseMock.expects('render').once().withArgs('system-admin/delete-user-confirmation', expectedData);

            await deleteUserConfirmationController.get(request, response);
            return responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should redirect to delete user success page if valid body data is provided', () => {
            const request = mockRequest(i18n);
            request.query = { id: validId1 };
            request.body = { 'delete-user-confirm': 'yes' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('/delete-user-success');

            return deleteUserConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render delete user confirmation page with error if no option selected', () => {
            const request = mockRequest(i18n);
            request.query = { id: validId1 };
            const responseMock = sinon.mock(response);

            responseMock
                .expects('render')
                .once()
                .withArgs(`system-admin/delete-user-confirmation`, {
                    ...i18n['delete-user-confirmation'],
                    userData,
                    noOptionError: true,
                });

            return deleteUserConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render error page if no user ID is provided', () => {
            const request = mockRequest(i18n);
            const responseMock = sinon.mock(response);

            responseMock
                .expects('render')
                .once()
                .withArgs('error', { ...i18n.error });

            return deleteUserConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render error page if delete user call fails', () => {
            const request = mockRequest(i18n);
            request.query = { id: validId2 };
            request.body = { 'delete-user-confirm': 'yes' };
            const responseMock = sinon.mock(response);

            responseMock
                .expects('render')
                .once()
                .withArgs('error', { ...i18n.error });

            return deleteUserConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should redirect to manage user if delete-user-confirm is set to no', () => {
            const request = mockRequest(i18n);
            request.query = { id: validId1 };
            request.body = { 'delete-user-confirm': 'no' };
            const responseMock = sinon.mock(response);

            responseMock
                .expects('redirect')
                .once()
                .withArgs('/manage-user?id=' + validId1);

            return deleteUserConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
