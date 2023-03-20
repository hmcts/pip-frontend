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
const auditStub = sinon.stub(UserManagementService.prototype, 'auditAction');

const adminId = '1234';
const email = 'test@test.com';

describe('Update user controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/update-user';

    afterEach(() => {
        auditStub.resetHistory();
    });

    request.user = { userId: adminId, email: email };

    it('should render the update user page', async () => {
        request.query = { id: '1234' };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['update-user'],
            selectBoxData: 'test',
            userId: '1234',
            email: 'test@email.com',
            currentRole: 'System Admin',
            error: false,
        };

        responseMock.expects('render').once().withArgs('update-user', expectedData);

        await updateUserController.get(request, response);
        sinon.assert.calledWith(
            auditStub,
            request.user,
            'MANAGE_USER',
            'Update user page requested containing user: 1234'
        );
        return responseMock.verify();
    });

    it('should render the update user page with error', async () => {
        request.query = { id: '1234', error: 'true' };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['update-user'],
            selectBoxData: 'test',
            userId: '1234',
            email: 'test@email.com',
            currentRole: 'System Admin',
            error: true,
        };

        responseMock.expects('render').once().withArgs('update-user', expectedData);

        await updateUserController.get(request, response);
        sinon.assert.calledWith(
            auditStub,
            request.user,
            'MANAGE_USER',
            'Update user page requested containing user: 1234'
        );
        return responseMock.verify();
    });
});

const stub = sinon.stub(AccountManagementRequests.prototype, 'updateUser');
const validBody = { userId: '1234', updatedRole: 'SYSTEM_ADMIN' };
const invalidBody = { userId: '1', updatedRole: 'WRONG_ROLE' };
const forbiddenBody = { userId: '2', updatedRole: 'FORBIDDEN' };

describe('Update User Confirmation Controller', () => {
    beforeEach(() => {
        stub.withArgs('1234', 'SYSTEM_ADMIN', adminId).resolves(true);
        stub.withArgs('1', 'WRONG_ROLE', adminId).resolves(null);
        stub.withArgs('2', 'FORBIDDEN', adminId).resolves('FORBIDDEN');
    });

    afterEach(() => {
        auditStub.resetHistory();
    });

    const i18n = {
        'update-user-confirmation': {},
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
    request.user = { userId: adminId, email: email };

    it('should render update user confirmation page if valid body data is provided', () => {
        request.body = validBody;
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('update-user-confirmation', {
                ...i18n['update-user-confirmation'],
                updatedRole: 'System Admin',
                isSystemAdmin: false,
            });

        return updateUserController.post(request, response).then(() => {
            sinon.assert.calledWith(
                auditStub,
                request.user,
                'UPDATE_USER',
                'User with id: 1234 has been updated to a: SYSTEM_ADMIN'
            );
            responseMock.verify();
        });
    });

    it('should render error page is update user call fails', () => {
        request.body = invalidBody;
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('error', { ...i18n.error });

        return updateUserController.post(request, response).then(() => {
            sinon.assert.calledWith(
                auditStub,
                request.user,
                'UPDATE_USER',
                'User with id: 1 failed to be updated to: WRONG_ROLE'
            );
            responseMock.verify();
        });
    });

    it('should redirect to update-user when call is forbidden', () => {
        request.body = forbiddenBody;
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/update-user?id=2&error=true');

        return updateUserController.post(request, response).then(() => {
            sinon.assert.calledWith(
                auditStub,
                request.user,
                'UPDATE_USER',
                'User has attempted to update their own role to: FORBIDDEN'
            );
            responseMock.verify();
        });
    });
});
