import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';

// Mock the services before importing the controller
const mockThirdPartyService = {
    createThirdPartySubscriberOathConfig: sinon.stub(),
    updateThirdPartySubscriberOathConfig: sinon.stub(),
};

const mockUserManagementService = {
    auditAction: sinon.stub(),
};

const mockKeyVaultService = {
    createOrUpdateSecret: sinon.stub(),
};

// Mock the module dependencies
jest.mock('../../../../main/service/ThirdPartyService', () => ({
    ThirdPartyService: jest.fn().mockImplementation(() => mockThirdPartyService),
}));

jest.mock('../../../../main/service/UserManagementService', () => ({
    UserManagementService: jest.fn().mockImplementation(() => mockUserManagementService),
}));

jest.mock('../../../../main/service/KeyVaultService', () => ({
    KeyVaultService: jest.fn().mockImplementation(() => mockKeyVaultService),
}));

import ManageThirdPartySubscriberOathConfigSummaryController from '../../../../main/controllers/system-admin/ManageThirdPartySubscriberOathConfigSummaryController';

const userId = 'test-user-123';
const adminUserId = 'admin-456';

const formDataCreate = {
    user: userId,
    createConfig: 'true',
    scopeKey: 'TestSubscriber-test-user-123-scope',
    clientIdKey: 'TestSubscriber-test-user-123-client-id',
    clientSecretKey: 'TestSubscriber-test-user-123-client-secret',
    scopeValue: 'read:data write:data',
    clientId: 'client-123',
    clientSecret: 'secret-456',
    authUrl: 'https://auth.example.com',
    tokenUrl: 'https://token.example.com',
};

const formDataUpdate = {
    user: userId,
    scopeKey: 'TestSubscriber-test-user-123-scope',
    clientIdKey: 'TestSubscriber-test-user-123-client-id',
    clientSecretKey: 'TestSubscriber-test-user-123-client-secret',
    scopeValue: 'read:data write:data',
    clientId: 'client-123',
    clientSecret: 'secret-456',
    authUrl: 'https://auth.example.com',
    tokenUrl: 'https://token.example.com',
};

const i18n = {
    'manage-third-party-subscriber-oath-config-summary': {
        title: 'Manage Third Party Subscriber OAuth Config Summary',
    },
};

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
    clearCookie: cookieName => {
        return cookieName;
    },
} as unknown as Response;

describe('ManageThirdPartySubscriberOathConfigSummaryController', () => {
    let controller: ManageThirdPartySubscriberOathConfigSummaryController;

    beforeEach(() => {
        controller = new ManageThirdPartySubscriberOathConfigSummaryController();

        // Reset all stubs
        mockThirdPartyService.createThirdPartySubscriberOathConfig.reset();
        mockThirdPartyService.updateThirdPartySubscriberOathConfig.reset();
        mockUserManagementService.auditAction.reset();
        mockKeyVaultService.createOrUpdateSecret.reset();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET request', () => {
        it('should render the summary page with form data from cookies', () => {
            const request = mockRequest(i18n);
            request.cookies = { thirdPartySubscriberCookie: JSON.stringify(formDataCreate) };

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oath-config-summary'],
                formData: formDataCreate,
                displayError: false,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oath-config-summary', expectedOptions);

            controller.get(request, response);
            responseMock.verify();
        });

        it('should render the summary page with empty form data when no cookie exists', () => {
            const request = mockRequest(i18n);
            request.cookies = {};

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oath-config-summary'],
                formData: {},
                displayError: false,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oath-config-summary', expectedOptions);

            controller.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should create new config, update secrets, audit, and redirect on success', async () => {
            const request = mockRequest(i18n);
            request.cookies = { thirdPartySubscriberCookie: JSON.stringify(formDataCreate) };
            request.user = { userId: adminUserId };

            mockThirdPartyService.createThirdPartySubscriberOathConfig
                .withArgs(formDataCreate, adminUserId)
                .resolves(true);

            mockKeyVaultService.createOrUpdateSecret.resolves(true);
            mockUserManagementService.auditAction.resolves();

            const responseMock = sinon.mock(response);

            responseMock.expects('clearCookie').once().withArgs('thirdPartySubscriberCookie');
            responseMock.expects('redirect').once().withArgs('/manage-third-party-subscriber-oath-config-success');

            await controller.post(request, response);

            // Verify KeyVault secrets were created
            sinon.assert.calledWith(
                mockKeyVaultService.createOrUpdateSecret,
                formDataCreate.scopeKey,
                formDataCreate.scopeValue
            );
            sinon.assert.calledWith(
                mockKeyVaultService.createOrUpdateSecret,
                formDataCreate.clientIdKey,
                formDataCreate.clientId
            );
            sinon.assert.calledWith(
                mockKeyVaultService.createOrUpdateSecret,
                formDataCreate.clientSecretKey,
                formDataCreate.clientSecret
            );

            // Verify audit action was called
            sinon.assert.calledWith(
                mockUserManagementService.auditAction,
                request.user,
                'THIRD_PARTY_SUBSCRIBER_OATH_CONFIG_CREATED',
                'Third party oath config created successfully'
            );

            responseMock.verify();
        });

        it('should update existing config, update secrets, audit, and redirect on success', async () => {
            const request = mockRequest(i18n);
            request.cookies = { thirdPartySubscriberCookie: JSON.stringify(formDataUpdate) };
            request.user = { userId: adminUserId };

            mockThirdPartyService.updateThirdPartySubscriberOathConfig
                .withArgs(formDataUpdate, adminUserId)
                .resolves(true);

            mockKeyVaultService.createOrUpdateSecret.resolves(true);
            mockUserManagementService.auditAction.resolves();

            const responseMock = sinon.mock(response);

            responseMock.expects('clearCookie').once().withArgs('thirdPartySubscriberCookie');
            responseMock.expects('redirect').once().withArgs('/manage-third-party-subscriber-oath-config-success');

            await controller.post(request, response);

            // Verify update was called instead of create
            sinon.assert.calledOnce(mockThirdPartyService.updateThirdPartySubscriberOathConfig);
            sinon.assert.notCalled(mockThirdPartyService.createThirdPartySubscriberOathConfig);

            // Verify KeyVault secrets were updated
            sinon.assert.calledThrice(mockKeyVaultService.createOrUpdateSecret);

            responseMock.verify();
        });

        it('should render page with error when config creation fails', async () => {
            const request = mockRequest(i18n);
            request.cookies = { thirdPartySubscriberCookie: JSON.stringify(formDataCreate) };
            request.user = { userId: adminUserId };

            mockThirdPartyService.createThirdPartySubscriberOathConfig
                .withArgs(formDataCreate, adminUserId)
                .resolves(false);

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oath-config-summary'],
                formData: formDataCreate,
                displayError: true,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oath-config-summary', expectedOptions);

            await controller.post(request, response);

            // Verify secrets were NOT created
            sinon.assert.notCalled(mockKeyVaultService.createOrUpdateSecret);

            // Verify audit was NOT called
            sinon.assert.notCalled(mockUserManagementService.auditAction);

            responseMock.verify();
        });

        it('should render page with error when config update fails', async () => {
            const request = mockRequest(i18n);
            request.cookies = { thirdPartySubscriberCookie: JSON.stringify(formDataUpdate) };
            request.user = { userId: adminUserId };

            mockThirdPartyService.updateThirdPartySubscriberOathConfig
                .withArgs(formDataUpdate, adminUserId)
                .resolves(false);

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oath-config-summary'],
                formData: formDataUpdate,
                displayError: true,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oath-config-summary', expectedOptions);

            await controller.post(request, response);

            // Verify secrets were NOT updated
            sinon.assert.notCalled(mockKeyVaultService.createOrUpdateSecret);

            // Verify audit was NOT called
            sinon.assert.notCalled(mockUserManagementService.auditAction);

            responseMock.verify();
        });

        it('should handle empty cookie gracefully', async () => {
            const request = mockRequest(i18n);
            request.cookies = {};
            request.user = { userId: adminUserId };

            mockThirdPartyService.updateThirdPartySubscriberOathConfig.withArgs({}, adminUserId).resolves(false);

            const responseMock = sinon.mock(response);
            const expectedOptions = {
                ...i18n['manage-third-party-subscriber-oath-config-summary'],
                formData: {},
                displayError: true,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriber-oath-config-summary', expectedOptions);

            await controller.post(request, response);
            responseMock.verify();
        });
    });
});
