import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import CreateSystemAdminAccountController from '../../../main/controllers/CreateSystemAdminAccountController';
import { CreateAccountService } from '../../../main/service/createAccountService';

const mockData = {
    firstName: 'joe',
    lastName: 'bloggs',
    emailAddress: 'joe.bloggs@mail.com',
};

const validationErrors = { foo: { message: 'error' } };
const createSystemAdminAccountController = new CreateSystemAdminAccountController();
const validationStub = sinon.stub(CreateAccountService.prototype, 'validateAdminFormFields');
validationStub.withArgs(mockData).returns({ foo: { message: null } });
validationStub.withArgs({}).returns(validationErrors);

describe('Create System Admin Account Controller', () => {
    const i18n = { 'create-system-admin-account': {} };
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request['cookies'] = { createAdminAccount: JSON.stringify(mockData) };

    describe('get requests', () => {
        it('should render create system admin account page with set cookie', async () => {
            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['create-admin-account'],
                formData: JSON.parse(request['cookies'].createAdminAccount),
            };

            responseMock.expects('render').once().withArgs('create-system-admin-account', expectedOptions);
            await createSystemAdminAccountController.get(request, response);
            await responseMock.verify();
        });

        it('should render create system admin account page without cookie', async () => {
            request['cookies'] = {};
            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['create-system-admin-account'],
                formData: null,
            };

            responseMock.expects('render').once().withArgs('create-system-admin-account', expectedOptions);
            await createSystemAdminAccountController.get(request, response);
            await responseMock.verify();
        });
    });

    describe('post requests', () => {
        it('should render create system admin account page with errors', async () => {
            const responseMock = sinon.mock(response);
            request.body = {};
            const expectedOptions = {
                ...i18n['create-system-admin-account'],
                formErrors: validationErrors,
                formData: {},
            };

            responseMock.expects('render').once().withArgs('create-system-admin-account', expectedOptions);
            await createSystemAdminAccountController.post(request, response);
            await responseMock.verify();
        });

        it('should redirect to create system admin account summary page', async () => {
            const response = {
                redirect: () => {
                    return '';
                },
                cookie: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);
            request.body = mockData;

            responseMock.expects('redirect').once().withArgs('create-system-admin-account-summary');
            await createSystemAdminAccountController.post(request, response);
            await responseMock.verify();
        });
    });
});
