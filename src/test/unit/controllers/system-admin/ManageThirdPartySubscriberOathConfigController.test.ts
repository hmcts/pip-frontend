import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';

// Mock the services before importing the controller
const mockThirdPartyService = {
    getThirdPartySubscriberById: sinon.stub(),
    validateThirdPartySubscriberOathConfigFormFields: sinon.stub(),
};

const mockThirdPartyRequests = {
    getThirdPartySubscriberOathConfigByUserId: sinon.stub(),
};

const mockKeyVaultService = {
    createKeyVaultSecretName: sinon.stub(),
    getSecret: sinon.stub(),
};

// Mock the module dependencies
jest.mock('../../../../main/service/ThirdPartyService', () => ({
    ThirdPartyService: jest.fn().mockImplementation(() => mockThirdPartyService),
}));

jest.mock('../../../../main/resources/requests/ThirdPartyRequests', () => ({
    ThirdPartyRequests: jest.fn().mockImplementation(() => mockThirdPartyRequests),
}));

jest.mock('../../../../main/service/KeyVaultService', () => ({
    KeyVaultService: jest.fn().mockImplementation(() => mockKeyVaultService),
}));

import ManageThirdPartySubscriberOathConfigController from '../../../../main/controllers/system-admin/ManageThirdPartySubscriberOathConfigController';

const userId = 'test-user-123';
const adminUserId = 'admin-456';

const mockThirdPartySubscriber = {
    name: 'TestSubscriber',
    userId: userId,
};

const existingConfigData = {
    user: userId,
    scopeKey: 'TestSubscriber-test-user-123-scope',
    clientIdKey: 'TestSubscriber-test-user-123-client-id',
    clientSecretKey: 'TestSubscriber-test-user-123-client-secret',
    authUrl: 'https://auth.example.com',
    tokenUrl: 'https://token.example.com',
};

const newConfigFormData = {
    user: userId,
    createConfig: 'true',
    scopeKey: 'TestSubscriber-test-user-123-scope',
    clientIdKey: 'TestSubscriber-test-user-123-client-id',
    clientSecretKey: 'TestSubscriber-test-user-123-client-secret',
};

const formDataWithValues = {
    ...existingConfigData,
    scopeValue: 'read:data write:data',
    clientId: 'client-123',
};

const postFormData = {
    user: userId,
    scopeKey: 'TestSubscriber-test-user-123-scope',
    clientIdKey: 'TestSubscriber-test-user-123-client-id',
    clientSecretKey: 'TestSubscriber-test-user-123-client-secret',
    scopeValue: 'read:data',
    clientId: 'client-123',
    clientSecret: 'secret-456',
    authUrl: 'https://auth.example.com',
    tokenUrl: 'https://token.example.com',
};

const formErrors = {
    scopeValueError: 'Scope is required',
    clientIdError: 'Client ID is required',
};

const i18n = {
    'manage-third-party-subscriber-oath-config': {
        title: 'Manage Third Party Subscriber OAuth Config',
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

describe('ManageThirdPartySubscriberOathConfigController', () => {
    let controller: ManageThirdPartySubscriberOathConfigController;

    beforeEach(() => {
        controller = new ManageThirdPartySubscriberOathConfigController();

        // Reset all stubs
        mockThirdPartyRequests.getThirdPartySubscriberOathConfigByUserId.reset();
        mockThirdPartyService.getThirdPartySubscriberById.reset();
        mockThirdPartyService.validateThirdPartySubscriberOathConfigFormFields.reset();
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
                ...i18n['manage-third-party-subscriber-oath-config'],
                formData: existingConfigData,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oath-config', expectedOptions);

            await controller.get(request, response);
            responseMock.verify();
        });

        it('should fetch and render existing config when user does not match cookie', async () => {
            const request = mockRequest(i18n);
            request.cookies = { thirdPartySubscriberCookie: JSON.stringify({ user: 'different-user' }) };
            request.query = { userId: userId };
            request.user = { userId: adminUserId };

            mockThirdPartyRequests.getThirdPartySubscriberOathConfigByUserId
                .withArgs(userId, adminUserId)
                .resolves(existingConfigData);
            mockThirdPartyService.getThirdPartySubscriberById
                .withArgs(userId, adminUserId)
                .resolves(mockThirdPartySubscriber);
            mockKeyVaultService.getSecret.withArgs(existingConfigData.scopeKey).resolves('read:data write:data');
            mockKeyVaultService.getSecret.withArgs(existingConfigData.clientIdKey).resolves('client-123');

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oath-config'],
                formData: formDataWithValues,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oath-config', expectedOptions);

            await controller.get(request, response);
            responseMock.verify();
        });

        it('should create new config keys when config does not exist', async () => {
            const request = mockRequest(i18n);
            request.cookies = {};
            request.query = { userId: userId };
            request.user = { userId: adminUserId };

            mockThirdPartyRequests.getThirdPartySubscriberOathConfigByUserId
                .withArgs(userId, adminUserId)
                .resolves(null);
            mockThirdPartyService.getThirdPartySubscriberById
                .withArgs(userId, adminUserId)
                .resolves(mockThirdPartySubscriber);
            mockKeyVaultService.createKeyVaultSecretName
                .withArgs(mockThirdPartySubscriber.name, userId, 'scope')
                .returns(newConfigFormData.scopeKey);
            mockKeyVaultService.createKeyVaultSecretName
                .withArgs(mockThirdPartySubscriber.name, userId, 'client-id')
                .returns(newConfigFormData.clientIdKey);
            mockKeyVaultService.createKeyVaultSecretName
                .withArgs(mockThirdPartySubscriber.name, userId, 'client-secret')
                .returns(newConfigFormData.clientSecretKey);

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oath-config'],
                formData: newConfigFormData,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oath-config', expectedOptions);

            await controller.get(request, response);
            responseMock.verify();
        });

        it('should create new config keys when config is not an object', async () => {
            const request = mockRequest(i18n);
            request.cookies = {};
            request.query = { userId: userId };
            request.user = { userId: adminUserId };

            mockThirdPartyRequests.getThirdPartySubscriberOathConfigByUserId
                .withArgs(userId, adminUserId)
                .resolves('invalid-data');
            mockThirdPartyService.getThirdPartySubscriberById
                .withArgs(userId, adminUserId)
                .resolves(mockThirdPartySubscriber);
            mockKeyVaultService.createKeyVaultSecretName
                .withArgs(mockThirdPartySubscriber.name, userId, 'scope')
                .returns(newConfigFormData.scopeKey);
            mockKeyVaultService.createKeyVaultSecretName
                .withArgs(mockThirdPartySubscriber.name, userId, 'client-id')
                .returns(newConfigFormData.clientIdKey);
            mockKeyVaultService.createKeyVaultSecretName
                .withArgs(mockThirdPartySubscriber.name, userId, 'client-secret')
                .returns(newConfigFormData.clientSecretKey);

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oath-config'],
                formData: newConfigFormData,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oath-config', expectedOptions);

            await controller.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should render page with errors when validation fails', () => {
            const request = mockRequest(i18n);
            request.body = postFormData;

            mockThirdPartyService.validateThirdPartySubscriberOathConfigFormFields
                .withArgs(postFormData)
                .returns(formErrors);

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oath-config'],
                formData: postFormData,
                formErrors: formErrors,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oath-config', expectedOptions);

            controller.post(request, response);
            responseMock.verify();
        });

        it('should set cookie and redirect to summary page when validation passes', () => {
            const request = mockRequest(i18n);
            request.body = postFormData;

            mockThirdPartyService.validateThirdPartySubscriberOathConfigFormFields.withArgs(postFormData).returns(null);

            const responseMock = sinon.mock(response);

            responseMock
                .expects('cookie')
                .once()
                .withArgs('thirdPartySubscriberCookie', JSON.stringify(postFormData), { secure: true, httpOnly: true });

            responseMock.expects('redirect').once().withArgs('/manage-third-party-subscriber-oath-config-summary');

            controller.post(request, response);
            responseMock.verify();
        });
    });
});
