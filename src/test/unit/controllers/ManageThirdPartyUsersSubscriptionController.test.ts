import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import { ThirdPartyService } from '../../../main/service/thirdPartyService';
import { PublicationService } from '../../../main/service/publicationService';
import { SubscriptionService } from '../../../main/service/subscriptionService';
import { cloneDeep } from 'lodash';
import ManageThirdPartyUsersSubscriptionsController from '../../../main/controllers/ManageThirdPartyUsersSubscriptionsController';

const manageThirdPartyUsersSubscriptionsController = new ManageThirdPartyUsersSubscriptionsController();

describe('Manage third party users subscription controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    const userId = '1234-1234';
    const getThirdPartyUserByIdStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartyUserById');

    describe('get third party subscription controller', () => {
        const i18n = { 'manage-third-party-users-subscriptions': {} };
        const request = mockRequest(i18n);

        const getListTypesStub = sinon.stub(PublicationService.prototype, 'getListTypes');
        const getSubscriptionsByUserStub = sinon.stub(SubscriptionService.prototype, 'getSubscriptionsByUser');
        const getChannelsListStub = sinon.stub(SubscriptionService.prototype, 'retrieveChannels');
        const generateListTypesStub = sinon.stub(ThirdPartyService.prototype, 'generateListTypes');
        const generateAvailableChannelsStub = sinon.stub(ThirdPartyService.prototype, 'generateAvailableChannels');

        it('should render third party subscriptions page', async () => {
            request['query'] = { userId: userId };
            getThirdPartyUserByIdStub.withArgs(userId).resolves({ userId: userId });
            getListTypesStub.returns(['LIST_A', 'LIST_B']);
            getSubscriptionsByUserStub.withArgs(userId).resolves({ listTypeSubscriptions: [] });
            getChannelsListStub.resolves(['CHANNEL_A', 'EMAIL']);
            generateListTypesStub.withArgs(['LIST_A', 'LIST_B'], { listTypeSubscriptions: [] }).returns({});
            generateAvailableChannelsStub.withArgs(['CHANNEL_A'], { listTypeSubscriptions: [] }).returns({});

            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-users-subscriptions']),
                listTypes: {},
                userId: userId,
                channelItems: {},
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('manage-third-party-users-subscriptions', options);

            await manageThirdPartyUsersSubscriptionsController.get(request, response);
            responseMock.verify();
        });

        it('should error page if user Id not present', async () => {
            request['query'] = {};

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

            await manageThirdPartyUsersSubscriptionsController.get(request, response);
            responseMock.verify();
        });

        it('should error page if no user is found', async () => {
            request['query'] = { userId: userId };
            getThirdPartyUserByIdStub.withArgs(userId).resolves(null);
            getListTypesStub.returns(['LIST_A', 'LIST_B']);
            getSubscriptionsByUserStub.withArgs(userId).resolves({ listTypeSubscriptions: [] });
            getChannelsListStub.resolves(['CHANNEL_A', 'EMAIL']);

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

            await manageThirdPartyUsersSubscriptionsController.get(request, response);
            responseMock.verify();
        });
    });

    describe('post third party subscription controller', () => {
        const i18n = { 'manage-third-party-users-confirm': {} };
        const request = mockRequest(i18n);

        const updateThirdPartySubsStub = sinon.stub(ThirdPartyService.prototype, 'handleThirdPartySubscriptionUpdate');

        it('should render the third party confirmation page', async () => {
            request['body'] = {
                userId: userId,
                channel: 'CHANNEL_A',
                'list-selections[]': ['LIST_SELECTION'],
            };

            getThirdPartyUserByIdStub.withArgs(userId).resolves({ userId: userId });
            updateThirdPartySubsStub.withArgs(userId, 'CHANNEL_A', ['LIST_SELECTION']).resolves();

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs(
                    'manage-third-party-users-subscriptions-confirm',
                    request.i18n.getDataByLanguage(request.lng)['manage-third-party-users-subscriptions-confirm']
                );

            await manageThirdPartyUsersSubscriptionsController.post(request, response);
            responseMock.verify();
        });

        it('should render error page when no channel set', async () => {
            request['body'] = {
                userId: userId,
                'list-selections[]': ['LIST_SELECTION'],
            };

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

            await manageThirdPartyUsersSubscriptionsController.post(request, response);
            responseMock.verify();
        });

        it('should render error page when no user set', async () => {
            request['body'] = {
                channel: 'CHANNEL_A',
                'list-selections[]': ['LIST_SELECTION'],
            };

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

            await manageThirdPartyUsersSubscriptionsController.post(request, response);
            responseMock.verify();
        });

        it('should render error page when user not found', async () => {
            request['body'] = {
                userId: userId,
                channel: 'CHANNEL_A',
                'list-selections[]': ['LIST_SELECTION'],
            };

            getThirdPartyUserByIdStub.withArgs(userId).resolves(null);

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

            await manageThirdPartyUsersSubscriptionsController.post(request, response);
            responseMock.verify();
        });
    });
});
