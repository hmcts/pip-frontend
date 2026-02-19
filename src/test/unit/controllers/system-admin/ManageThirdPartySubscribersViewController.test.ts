import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import { Response } from 'express';
import { ThirdPartyService } from '../../../../main/service/ThirdPartyService';
import { cloneDeep } from 'lodash';
import ManageThirdPartySubscribersViewController from '../../../../main/controllers/system-admin/ManageThirdPartySubscribersViewController';

const manageThirdPartySubscribersViewController = new ManageThirdPartySubscribersViewController();

const i18n = {
    'manage-third-party-subscribers': {},
    error: {},
};
const request = mockRequest(i18n);
const response = {
    render: () => {
        return '';
    },
} as unknown as Response;

const userId = '1234-1234';
const userId2 = '1234-1235';
const userId3 = '1234-1236';
const userId4 = '1234-1237';
const userId5 = '1234-1238';

const mockUser = { userId: userId };
const mockConfig = {
    scope: 'scope',
    clientId: 'clientId',
    clientSecret: 'clientSecret',
};
const responseMessage = 'Test message';

const getThirdPartyByUserIdStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriberById');
getThirdPartyByUserIdStub.withArgs(userId).resolves(mockUser);
getThirdPartyByUserIdStub.withArgs(userId2).resolves(null);
getThirdPartyByUserIdStub.withArgs(userId3).resolves(mockUser);
getThirdPartyByUserIdStub.withArgs(userId4).resolves(mockUser);
getThirdPartyByUserIdStub.withArgs(userId5).resolves(mockUser);

const getThirdPartyOauthConfigStub = sinon.stub(
    ThirdPartyService.prototype,
    'getThirdPartySubscriberOauthConfigByUserId'
);
getThirdPartyOauthConfigStub.withArgs(userId).resolves(mockConfig);
getThirdPartyOauthConfigStub.withArgs(userId3).resolves(null);
getThirdPartyOauthConfigStub.withArgs(userId4).resolves(mockConfig);
getThirdPartyOauthConfigStub.withArgs(userId5).resolves(mockConfig);

const healthCheckStub = sinon.stub(ThirdPartyService.prototype, 'thirdPartyConfigurationHealthCheck');
healthCheckStub.withArgs(userId).resolves(true);
healthCheckStub.withArgs(userId4).resolves(false);
healthCheckStub.withArgs(userId5).resolves(responseMessage);

describe('Manage third party subscribers view Controller', () => {
    describe('GET request', () => {
        it('should render third party subscribers page', async () => {
            request['query'] = { userId: userId };

            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-subscribers-view']),
                userDetails: mockUser,
                healthCheck: {},
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('system-admin/manage-third-party-subscribers-view', options);

            await manageThirdPartySubscribersViewController.get(request, response);
            responseMock.verify();
        });

        it('should render third party subscribers page when more than one sub', async () => {
            request['query'] = { userId: userId };

            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-subscribers-view']),
                userDetails: mockUser,
                healthCheck: {},
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('system-admin/manage-third-party-subscribers-view', options);

            await manageThirdPartySubscribersViewController.get(request, response);
            responseMock.verify();
        });

        it('should render error page if no user supplied', async () => {
            request['query'] = {};

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

            await manageThirdPartySubscribersViewController.get(request, response);

            responseMock.verify();
        });

        it('should render error page if no user can be found', async () => {
            request['query'] = { userId: userId2 };

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

            await manageThirdPartySubscribersViewController.get(request, response);

            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should render third party subscribers page with success health check message', async () => {
            request['query'] = { userId: userId };

            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-subscribers-view']),
                userDetails: mockUser,
                healthCheck: { success: true },
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('system-admin/manage-third-party-subscribers-view', options);

            await manageThirdPartySubscribersViewController.post(request, response);
            responseMock.verify();
        });

        it('should render third party subscribers page with missing configuration error', async () => {
            request['query'] = { userId: userId3 };

            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-subscribers-view']),
                userDetails: mockUser,
                healthCheck: { missingConfigurationError: true },
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('system-admin/manage-third-party-subscribers-view', options);

            await manageThirdPartySubscribersViewController.post(request, response);
            responseMock.verify();
        });

        it('should render third party subscribers page with generic error', async () => {
            request['query'] = { userId: userId4 };

            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-subscribers-view']),
                userDetails: mockUser,
                healthCheck: { thirdPartyRequestError: true },
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('system-admin/manage-third-party-subscribers-view', options);

            await manageThirdPartySubscribersViewController.post(request, response);
            responseMock.verify();
        });

        it('should render third party subscribers page with response error message', async () => {
            request['query'] = { userId: userId5 };

            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-subscribers-view']),
                userDetails: mockUser,
                healthCheck: { thirdPartyErrorMessage: responseMessage },
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('system-admin/manage-third-party-subscribers-view', options);

            await manageThirdPartySubscribersViewController.post(request, response);
            responseMock.verify();
        });

        it('should render error page if no user supplied', async () => {
            request['query'] = {};

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

            await manageThirdPartySubscribersViewController.post(request, response);

            responseMock.verify();
        });

        it('should render error page if no user can be found', async () => {
            request['query'] = { userId: userId2 };

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

            await manageThirdPartySubscribersViewController.post(request, response);

            responseMock.verify();
        });
    });
});
