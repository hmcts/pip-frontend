import { mockRequest } from '../../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import UpdateUserController from '../../../../main/controllers/admin/UpdateUserController';
import { UserManagementService } from '../../../../main/service/UserManagementService';
import { AccountManagementRequests } from '../../../../main/resources/requests/AccountManagementRequests';
import { v4 as uuidv4 } from 'uuid';

const updateUserController = new UpdateUserController();

const userId = uuidv4();

const i18n = {
    admin: {
        'update-user': {},
    },
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
        request.query = { id: userId };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['admin']['update-user'],
            selectBoxData: 'test',
            userId: userId,
            email: 'test@email.com',
            currentRole: 'System Admin',
            error: false,
        };

        responseMock.expects('render').once().withArgs('admin/update-user', expectedData);

        await updateUserController.get(request, response);
        sinon.assert.calledWith(
            auditStub,
            request.user,
            'MANAGE_USER',
            `Update user page requested containing user: ${userId}`
        );
        return responseMock.verify();
    });

    it('should render the update user page with error', async () => {
        request.query = { id: userId, error: 'true' };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['admin']['update-user'],
            selectBoxData: 'test',
            userId: userId,
            email: 'test@email.com',
            currentRole: 'System Admin',
            error: true,
        };

        responseMock.expects('render').once().withArgs('admin/update-user', expectedData);

        await updateUserController.get(request, response);
        sinon.assert.calledWith(
            auditStub,
            request.user,
            'MANAGE_USER',
            `Update user page requested containing user: ${userId}`
        );
        return responseMock.verify();
    });
});

const stub = sinon.stub(AccountManagementRequests.prototype, 'updateUser');

const userId2 = uuidv4();
const userId3 = uuidv4();
const invalidUserId = 'abcd';

const validBody = { userId: userId, updatedRole: 'SYSTEM_ADMIN' };
const invalidBody = { userId: userId2, updatedRole: 'WRONG_ROLE' };
const forbiddenBody = { userId: userId3, updatedRole: 'FORBIDDEN' };
const invalidUserIdBody = { userId: invalidUserId, updatedRole: 'SYSTEM_ADMIN' };

describe('Update User Confirmation Controller', () => {
    beforeEach(() => {
        stub.withArgs(userId, 'SYSTEM_ADMIN', adminId).resolves(true);
        stub.withArgs(userId2, 'WRONG_ROLE', adminId).resolves(null);
        stub.withArgs(userId3, 'FORBIDDEN', adminId).resolves('FORBIDDEN');
    });

    afterEach(() => {
        auditStub.resetHistory();
    });

    const i18n = {
        admin: {
            'update-user-confirmation': {},
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
    request.user = { userId: adminId, email: email };

    it('should render update user confirmation page if valid body data is provided', () => {
        request.body = validBody;
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('admin/update-user-confirmation', {
                ...i18n['admin']['update-user-confirmation'],
                updatedRole: 'System Admin',
                isSystemAdmin: false,
            });

        return updateUserController.post(request, response).then(() => {
            sinon.assert.calledWith(
                auditStub,
                request.user,
                'UPDATE_USER',
                `User with id: ${userId} has been updated to a: SYSTEM_ADMIN`
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
                `User with id: ${userId2} failed to be updated to: WRONG_ROLE`
            );
            responseMock.verify();
        });
    });

    it('should redirect to update-user when call is forbidden', () => {
        request.body = forbiddenBody;
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs(`/update-user?id=${userId3}&error=true`);

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

    it('should redirect to error page when invalid user id provided', () => {
        request.body = invalidUserIdBody;
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error');

        return updateUserController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to error page when no user id provided', () => {
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error');

        return updateUserController.post(request, response).then(() => {
            responseMock.verify();
        });
    });
});
