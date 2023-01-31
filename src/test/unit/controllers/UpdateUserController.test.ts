import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import UpdateUserController from '../../../main/controllers/UpdateUserController';
import { UserManagementService } from '../../../main/service/userManagementService';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';

const updateUserController = new UpdateUserController();

const i18n = {
    'update-user': {},
};

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves({
    email: 'test@email.com',
    roles: 'SYSTEM_ADMIN',
});

sinon.stub(UserManagementService.prototype, 'buildUserUpdateSelectBox').returns('test');

describe('Update user controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/update-user';

    it('should render the update user page', async () => {
        request.query = { id: '1234' };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['update-user'],
            selectBoxData: 'test',
            userId: '1234',
            email: 'test@email.com',
            currentRole: 'System Admin',
        };

        responseMock.expects('render').once().withArgs('update-user', expectedData);

        await updateUserController.get(request, response);
        return responseMock.verify();
    });
});
