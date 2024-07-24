import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import DeleteUserConfirmationController from '../../../../main/controllers/admin/DeleteUserConfirmationController';
import { AccountManagementRequests } from '../../../../main/resources/requests/AccountManagementRequests';
import { v4 as uuidv4 } from 'uuid';

const validUUID1 = uuidv4();
const validUUID2 = uuidv4();
const validUUID3 = uuidv4();

const stub = sinon.stub(AccountManagementRequests.prototype, 'deleteUser');
const validBody = { 'delete-user-confirm': 'yes', user: validUUID1 };
const invalidBody = { 'delete-user-confirm': 'yes', user: validUUID2 };
const redirectBody = { 'delete-user-confirm': 'no', user: validUUID3 };
const invalidUuid = { 'delete-user-confirm': 'no', user: 'abcd' };

const deleteUserConfirmationController = new DeleteUserConfirmationController();

describe('Delete User Confirmation Controller', () => {
    beforeEach(() => {
        stub.withArgs(validUUID1).resolves(true);
        stub.withArgs(validUUID2).resolves(undefined);
    });

    const i18n = {
        admin: {
            'delete-user-confirmation': {},
        },
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
            .withArgs('admin/delete-user-confirmation', {
                ...i18n['admin']['delete-user-confirmation'],
                isSystemAdmin: false,
            });

        return deleteUserConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render error page if body data is not a UUID', () => {
        request.body = invalidUuid;
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('error', { ...i18n.error });

        return deleteUserConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render error page if no body is provided', () => {
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

        responseMock
            .expects('redirect')
            .once()
            .withArgs('/manage-user?id=' + validUUID3);

        return deleteUserConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });
});
