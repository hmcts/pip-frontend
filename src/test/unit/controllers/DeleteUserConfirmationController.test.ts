import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import DeleteUserConfirmationController from '../../../main/controllers/DeleteUserConfirmationController';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';

const stub = sinon.stub(AccountManagementRequests.prototype, 'deleteUser');
const validBody = { 'delete-user-confirm': 'yes', user: '123' };
const invalidBody = { 'delete-user-confirm': 'yes', user: 'foo' };
const redirectBody = { 'delete-user-confirm': 'no', user: '1234' };
const deleteUserConfirmationController = new DeleteUserConfirmationController();

describe('Delete User Confirmation Controller', () => {
    beforeEach(() => {
        stub.withArgs('123').resolves(true);
        stub.withArgs('foo').resolves(undefined);
    });

    const i18n = {
        'delete-user-confirmation': {},
        error: {},
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

    it('should render delete user confirmation page if valid body data is provided', () => {
        request.body = validBody;
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('delete-user-confirmation', {
                ...i18n['delete-user-confirmation'],
                isSystemAdmin: false,
            });

        return deleteUserConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render error page if delete user call fails', () => {
        request.body = invalidBody;
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
        request.body = redirectBody;
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/manage-user?id=1234');

        return deleteUserConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });
});
