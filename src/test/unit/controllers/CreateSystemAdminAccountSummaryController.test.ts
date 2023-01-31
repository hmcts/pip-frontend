import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { CreateAccountService } from '../../../main/service/createAccountService';
import CreateSystemAdminAccountSummaryController from '../../../main/controllers/CreateSystemAdminAccountSummaryController';
import sinon from 'sinon';

const validUserId = '1234-1234-1234-1234';
const mockData = {
    firstName: 'joe',
    lastName: 'bloggs',
    emailAddress: 'joe.bloggs@mail.com',
    userRoleObject: {
        mapping: 'SYSTEM_ADMIN',
    },
};

const createSystemAdminAccountSummaryController = new CreateSystemAdminAccountSummaryController();

const createAccountStub = sinon.stub(CreateAccountService.prototype, 'createSystemAdminAccount');
createAccountStub.withArgs(mockData, validUserId).resolves({ userId: '1234' });

const invalidMockData = {
    firstName: 'INVALID_DATA',
    userRoleObject: { mapping: 'SYSTEM_ADMIN' },
};
createAccountStub.withArgs(invalidMockData, validUserId).resolves({
    error: 'General Error',
    duplicate: false,
    aboveMaxSystemAdmin: false,
});

const invalidMockDataDuplicate = {
    firstName: 'IS_DUPLICATE_DATA',
    userRoleObject: { mapping: 'SYSTEM_ADMIN' },
};
createAccountStub
    .withArgs(invalidMockDataDuplicate, validUserId)
    .resolves({ error: '', duplicate: true, aboveMaxSystemAdmin: false });

const invalidMockDataMaxUsers = {
    firstName: 'IS_MAX_USERS_DATA',
    userRoleObject: { mapping: 'SYSTEM_ADMIN' },
};
createAccountStub
    .withArgs(invalidMockDataMaxUsers, validUserId)
    .resolves({ error: '', duplicate: false, aboveMaxSystemAdmin: true });

describe('Create System Admin Account Summary Controller', () => {
    const i18n = { 'create-system-admin-account-summary': {} };
    const response = {
        render: () => {
            return '';
        },
        cookie: (cookieName, cookieValue) => {
            return cookieName + cookieValue;
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request['cookies'] = { createAdminAccount: JSON.stringify(mockData) };

    describe('on get', () => {
        it('should render create system admin account summary page', async () => {
            const responseMock = sinon.mock(response);
            const expectedOptions = {
                formData: mockData,
                accountCreated: false,
                displayError: false,
                ...i18n['create-system-admin-account-summary'],
            };

            responseMock.expects('render').once().withArgs('create-system-admin-account-summary', expectedOptions);

            await createSystemAdminAccountSummaryController.get(request, response);
            await responseMock.verify();
        });
    });

    describe('on post', () => {
        it('should render create system admin account confirm page with success message', async () => {
            request.user = { userId: validUserId };
            const responseMock = sinon.mock(response);
            const expectedOptions = {
                formData: mockData,
                accountCreated: true,
                isDuplicateError: undefined,
                isAboveMaxError: undefined,
                ...i18n['create-system-admin-account-confirm'],
            };

            responseMock.expects('render').once().withArgs('create-system-admin-account-confirm', expectedOptions);
            responseMock.expects('cookie').once().withArgs('createAdminAccount', '');
            await createSystemAdminAccountSummaryController.post(request, response);
            await responseMock.verify();
        });

        it('should render create system admin account summary page with general error', async () => {
            request['cookies'] = {
                createAdminAccount: JSON.stringify(invalidMockData),
            };
            request.user = { userId: validUserId };
            const responseMock = sinon.mock(response);
            const expectedOptions = {
                formData: invalidMockData,
                displayError: true,
                ...i18n['create-system-admin-account-summary'],
            };

            responseMock.expects('render').once().withArgs('create-system-admin-account-summary', expectedOptions);
            await createSystemAdminAccountSummaryController.post(request, response);
            await responseMock.verify();
        });

        it('should render create system admin account confirm page with duplicate error', async () => {
            request['cookies'] = {
                createAdminAccount: JSON.stringify(invalidMockDataDuplicate),
            };
            request.user = { userId: validUserId };
            const responseMock = sinon.mock(response);
            const expectedOptions = {
                formData: invalidMockDataDuplicate,
                accountCreated: false,
                isDuplicateError: true,
                isAboveMaxError: false,
                ...i18n['create-system-admin-account-confirm'],
            };

            responseMock.expects('render').once().withArgs('create-system-admin-account-confirm', expectedOptions);
            await createSystemAdminAccountSummaryController.post(request, response);
            await responseMock.verify();
        });

        it('should render create system admin account confirm page with max account error', async () => {
            request['cookies'] = {
                createAdminAccount: JSON.stringify(invalidMockDataMaxUsers),
            };
            request.user = { userId: validUserId };
            const responseMock = sinon.mock(response);
            const expectedOptions = {
                formData: invalidMockDataMaxUsers,
                accountCreated: false,
                isDuplicateError: false,
                isAboveMaxError: true,
                ...i18n['create-system-admin-account-confirm'],
            };

            responseMock.expects('render').once().withArgs('create-system-admin-account-confirm', expectedOptions);
            await createSystemAdminAccountSummaryController.post(request, response);
            await responseMock.verify();
        });
    });
});
