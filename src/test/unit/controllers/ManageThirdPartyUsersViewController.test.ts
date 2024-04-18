import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import { Response } from 'express';
import { ThirdPartyService } from '../../../main/service/thirdPartyService';
import { SubscriptionService } from '../../../main/service/subscriptionService';
import { cloneDeep } from 'lodash';
import ManageThirdPartyUsersViewController from '../../../main/controllers/ManageThirdPartyUsersViewController';

const manageThirdPartyUsersViewController = new ManageThirdPartyUsersViewController();

describe('Manage third party users view Controller', () => {
    const i18n = { 'manage-third-party-users': {}, error: {} };
    const request = mockRequest(i18n);
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    const getThirdPartyByUserIdStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartyUserById');
    const getSubscriptionsByUserStub = sinon.stub(SubscriptionService.prototype, 'getSubscriptionsByUser');

    const userId = '1234-1234';

    it('should render third party users page', async () => {
        const mockUser = { userId: userId };
        const mockSubscriptions = { listTypeSubscriptions: [] };
        request['query'] = { userId: userId };

        getThirdPartyByUserIdStub.withArgs(userId).resolves(mockUser);
        getSubscriptionsByUserStub.withArgs(userId).resolves(mockSubscriptions);

        const options = {
            ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-users-view']),
            userDetails: mockUser,
            numberOfSubscriptions: 0,
            subscriptionsChannel: '',
        };

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('manage-third-party-users-view', options);

        await manageThirdPartyUsersViewController.get(request, response);
        responseMock.verify();
    });

    it('should render third party users page when more than one sub', async () => {
        const mockUser = { userId: userId };
        const mockSubscriptions = {
            listTypeSubscriptions: [{ subscriptionId: '1234', channel: 'API' }],
        };
        request['query'] = { userId: userId };

        getThirdPartyByUserIdStub.withArgs(userId).resolves(mockUser);
        getSubscriptionsByUserStub.withArgs(userId).resolves(mockSubscriptions);

        const options = {
            ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-users-view']),
            userDetails: mockUser,
            numberOfSubscriptions: 1,
            subscriptionsChannel: 'API',
        };

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('manage-third-party-users-view', options);

        await manageThirdPartyUsersViewController.get(request, response);
        responseMock.verify();
    });

    it('should render error page if no user supplied', async () => {
        request['query'] = {};

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

        await manageThirdPartyUsersViewController.get(request, response);

        responseMock.verify();
    });

    it('should render error page if no user can be found', async () => {
        request['query'] = { userId: userId };

        getThirdPartyByUserIdStub.withArgs(userId).resolves(null);

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

        await manageThirdPartyUsersViewController.get(request, response);

        responseMock.verify();
    });
});
