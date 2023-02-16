import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import CreateAdminAccountController from '../../../main/controllers/CreateAdminAccountController';
import { CreateAccountService } from '../../../main/service/createAccountService';

const mockData = {
    firstName: 'joe',
    lastName: 'bloggs',
    emailAddress: 'joe.bloggs@mail.com',
    'user-role': 'admin-ctsc',
    userRoleObject: {
        key: 'admin-ctsc',
        text: 'Internal - Administrator - CTSC',
        mapping: 'INTERNAL_ADMIN_CTSC',
    },
};
const radios = [
    {
        value: 'super-admin-ctsc',
        text: 'Internal - Super Administrator - CTSC',
        checked: false,
        hint: {
            text: 'Upload, Remove, Create new accounts, Assess new media requests, User management',
        },
    },
    {
        value: 'super-admin-local',
        text: 'Internal - Super Administrator - Local',
        checked: false,
        hint: {
            text: 'Upload, Remove, Create new account, User management',
        },
    },
    {
        value: 'admin-ctsc',
        text: 'Internal - Administrator - CTSC',
        checked: true,
        hint: {
            text: 'Upload, Remove, Assess new media request',
        },
    },
    {
        value: 'admin-local',
        text: 'Internal - Administrator - Local',
        checked: false,
        hint: {
            text: 'Upload, Remove',
        },
    },
];
const validationErrors = { foo: { message: 'error' } };
const createAdminAccountController = new CreateAdminAccountController();
const validationStub = sinon.stub(CreateAccountService.prototype, 'validateAdminFormFieldsWithRole');
validationStub.withArgs(mockData).returns({ foo: { message: null } });
validationStub.withArgs({}).returns(validationErrors);

describe('Create Admin Account Controller', () => {
    const i18n = { 'create-admin-account': {} };
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request['cookies'] = { createAdminAccount: JSON.stringify(mockData) };

    describe('get requests', () => {
        it('should render create admin account page with set cookie', async () => {
            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['create-admin-account'],
                formData: JSON.parse(request['cookies'].createAdminAccount),
                radios,
            };

            responseMock.expects('render').once().withArgs('create-admin-account', expectedOptions);
            await createAdminAccountController.get(request, response);
            await responseMock.verify();
        });

        it('should render create admin account page without cookie', async () => {
            const uncheckedRadios = radios;
            uncheckedRadios[2].checked = false;
            request['cookies'] = {};
            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['create-admin-account'],
                formData: null,
                radios: uncheckedRadios,
            };

            responseMock.expects('render').once().withArgs('create-admin-account', expectedOptions);
            await createAdminAccountController.get(request, response);
            await responseMock.verify();
        });
    });

    describe('post requests', () => {
        it('should render create admin account page with errors', async () => {
            const responseMock = sinon.mock(response);
            const uncheckedRadios = radios;
            uncheckedRadios[2].checked = false;
            request.body = {};
            const expectedOptions = {
                ...i18n['create-admin-account'],
                radios: uncheckedRadios,
                formErrors: validationErrors,
                formData: {},
            };

            responseMock.expects('render').once().withArgs('create-admin-account', expectedOptions);
            await createAdminAccountController.post(request, response);
            await responseMock.verify();
        });

        it('should redirect to create admin account summary page', async () => {
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

            responseMock.expects('redirect').once().withArgs('create-admin-account-summary');
            await createAdminAccountController.post(request, response);
            await responseMock.verify();
        });
    });
});
