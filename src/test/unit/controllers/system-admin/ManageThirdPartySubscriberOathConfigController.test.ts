import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';

// Mock the services before importing the controller
const mockThirdPartyService = {
    validateThirdPartySubscriberOauthConfigFormFields: sinon.stub(),
    getThirdPartySubscriberOauthConfigByUserId: sinon.stub(),
};

const mockKeyVaultService = {
    createKeyVaultSecretName: sinon.stub(),
    getSecret: sinon.stub(),
};

// Mock the module dependencies
jest.mock('../../../../main/service/ThirdPartyService', () => ({
    ThirdPartyService: jest.fn().mockImplementation(() => mockThirdPartyService),
}));

jest.mock('../../../../main/service/KeyVaultService', () => ({
    KeyVaultService: jest.fn().mockImplementation(() => mockKeyVaultService),
}));

import ManageThirdPartySubscriberOauthConfigController from '../../../../main/controllers/system-admin/ManageThirdPartySubscriberOauthConfigController';

const userId = 'test-user-123';
const adminUserId = 'admin-456';
const scopeKey = 'TestSubscriber-test-user-123-scope';
const scopeValue = 'read:data write:data';
const clientIdKey = 'TestSubscriber-test-user-123-client-id';
const clientIdValue = 'client-123';
const clientSecretKey = 'TestSubscriber-test-user-123-client-secret';
const clientSecretValue = 'secret-123';

const existingConfigData = {
    user: userId,
    scopeKey: scopeKey,
    clientIdKey: clientIdKey,
    clientSecretKey: clientSecretKey,
    authUrl: 'https://auth.example.com',
    tokenUrl: 'https://token.example.com',
};

const newConfigFormData = {
    user: userId,
    createConfig: 'true',
};

const formDataWithValues = {
    ...existingConfigData,
    scope: scopeValue,
    clientId: clientIdValue,
    clientSecret: clientSecretValue,
};

const postFormData = {
    user: userId,
    scope: scopeValue,
    clientId: clientIdValue,
    clientSecret: clientSecretValue,
    authUrl: 'https://auth.example.com',
    tokenUrl: 'https://token.example.com',
};

const formErrors = {
    scopeError: 'Scope is required',
    clientIdError: 'Client ID is required',
};

const i18n = {
    'manage-third-party-subscriber-oauth-config': {
        title: 'Manage third-party subscriber OAuth Config',
    },
};

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
    cookie: (cookieName, cookieValue) => {
        return cookieName + cookieValue;
    },
} as unknown as Response;

describe('ManageThirdPartySubscriberOauthConfigController', () => {
    let controller: ManageThirdPartySubscriberOauthConfigController;

    beforeEach(() => {
        controller = new ManageThirdPartySubscriberOauthConfigController();

        // Reset all stubs
        mockThirdPartyService.getThirdPartySubscriberOauthConfigByUserId.reset();
        mockThirdPartyService.validateThirdPartySubscriberOauthConfigFormFields.reset();
        mockKeyVaultService.createKeyVaultSecretName.reset();
        mockKeyVaultService.getSecret.reset();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET request', () => {
        it('should render page with existing config from cookies when user matches', async () => {
            const request = mockRequest(i18n);
            request.cookies = { thirdPartySubscriberCookie: JSON.stringify(existingConfigData) };
            request.query = { userId: userId };
            request.user = { userId: adminUserId };

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oauth-config'],
                formData: existingConfigData,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oauth-config', expectedOptions);

            await controller.get(request, response);
            responseMock.verify();
        });

        it('should fetch and render existing config when user does not match cookie', async () => {
            const request = mockRequest(i18n);
            request.cookies = { thirdPartySubscriberCookie: JSON.stringify({ user: 'different-user' }) };
            request.query = { userId: userId };
            request.user = { userId: adminUserId };

            mockThirdPartyService.getThirdPartySubscriberOauthConfigByUserId
                .withArgs(userId, adminUserId)
                .resolves(existingConfigData);
            mockKeyVaultService.getSecret.withArgs(existingConfigData.scopeKey).resolves('read:data write:data');
            mockKeyVaultService.getSecret.withArgs(existingConfigData.clientIdKey).resolves('client-123');
            mockKeyVaultService.getSecret.withArgs(existingConfigData.clientSecretKey).resolves('secret-123');

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oauth-config'],
                formData: formDataWithValues,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oauth-config', expectedOptions);

            await controller.get(request, response);
            responseMock.verify();
        });

        it('should create new config keys when config does not exist', async () => {
            const request = mockRequest(i18n);
            request.cookies = {};
            request.query = { userId: userId };
            request.user = { userId: adminUserId };

            mockThirdPartyService.getThirdPartySubscriberOauthConfigByUserId
                .withArgs(userId, adminUserId)
                .resolves(null);

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oauth-config'],
                formData: newConfigFormData,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oauth-config', expectedOptions);

            await controller.get(request, response);
            responseMock.verify();
        });

        it('should create new config keys when config is not an object', async () => {
            const request = mockRequest(i18n);
            request.cookies = {};
            request.query = { userId: userId };
            request.user = { userId: adminUserId };

            mockThirdPartyService.getThirdPartySubscriberOauthConfigByUserId
                .withArgs(userId, adminUserId)
                .resolves('invalid-data');

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oauth-config'],
                formData: newConfigFormData,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oauth-config', expectedOptions);

            await controller.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should render page with errors when validation fails', () => {
            const request = mockRequest(i18n);
            request.body = postFormData;

            mockThirdPartyService.validateThirdPartySubscriberOauthConfigFormFields
                .withArgs(postFormData)
                .returns(formErrors);

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oauth-config'],
                formData: postFormData,
                formErrors: formErrors,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oauth-config', expectedOptions);

            controller.post(request, response);
            responseMock.verify();
        });

        it('should set cookie and redirect to summary page when validation passes', () => {
            const request = mockRequest(i18n);
            request.body = postFormData;

            mockThirdPartyService.validateThirdPartySubscriberOauthConfigFormFields
                .withArgs(postFormData)
                .returns(null);

            const responseMock = sinon.mock(response);

            responseMock
                .expects('cookie')
                .once()
                .withArgs('thirdPartySubscriberCookie', JSON.stringify(postFormData), { secure: true, httpOnly: true });

            responseMock.expects('redirect').once().withArgs('/manage-third-party-subscriber-oauth-config-summary');

            controller.post(request, response);
            responseMock.verify();
        });
    });
});
