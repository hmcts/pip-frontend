import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import { UserManagementService } from '../../../main/service/userManagementService';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import ManageUserController from '../../../main/controllers/ManageUserController';

const manageUserController = new ManageUserController();

const i18n = {
    'manage-user': {},
};

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves({
    userId: '1234',
    email: 'test@email.com',
    roles: 'SYSTEM_ADMIN',
});

sinon.stub(UserManagementService.prototype, 'buildManageUserSummaryList').returns('test');

describe('Manage user controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/manage-user';

    it('should render the manage user page', async () => {
        request.query = { id: '1234' };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['manage-user'],
            email: 'test@email.com',
            formattedData: 'test',
            hrefDeletion: '/delete-user?id=1234',
        };

        responseMock.expects('render').once().withArgs('manage-user', expectedData);

        await manageUserController.get(request, response);
        return responseMock.verify();
    });
});
