import { mockRequest } from '../../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../../../main/resources/requests/AccountManagementRequests';
import DeleteUserController from '../../../../main/controllers/system-admin/DeleteUserController';

const deleteUserController = new DeleteUserController();

const i18n = {
    'delete-user': {},
};

const userData = {
    email: 'test@email.com',
    roles: 'SYSTEM_ADMIN',
};

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves(userData);

describe('Delete user controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);

    it('should render the delete user page', async () => {
        request.query = { id: '1234' };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-user'],
            userData,
            userId: '1234',
        };

        responseMock.expects('render').once().withArgs('system-admin/delete-user', expectedData);

        await deleteUserController.get(request, response);
        return responseMock.verify();
    });
});
