import sinon from 'sinon';
import { Response } from 'express';
import { SubscriptionService } from '../../../main/service/SubscriptionService';
import { mockRequest } from '../mocks/mockRequest';
import SubscriptionConfirmedController from '../../../main/controllers/SubscriptionConfirmedController';
import { PendingSubscriptionsFromCache } from '../../../main/service/PendingSubscriptionsFromCache';

const subscriptionConfirmedController = new SubscriptionConfirmedController();
const subscribeStub = sinon.stub(SubscriptionService.prototype, 'subscribe');
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
subscribeStub.withArgs('1').resolves(true);
subscribeStub.withArgs('2').resolves(false);
subscribeStub.withArgs('3').resolves(false);
cacheStub.withArgs('1', 'cases').resolves(['cached case']);
cacheStub.withArgs('1', 'courts').resolves(['cached court']);
cacheStub.withArgs('1', 'listTypes').resolves(['list type']);
cacheStub.withArgs('2', 'cases').resolves(['cached case']);
cacheStub.withArgs('2', 'courts').resolves(['cached court']);
cacheStub.withArgs('2', 'listTypes').resolves(['list type']);
cacheStub.withArgs('3', 'cases').resolves([]);
cacheStub.withArgs('3', 'courts').resolves([]);
cacheStub.withArgs('3', 'listTypes').resolves([]);

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;
const i18n = {
    'subscription-confirmed': {},
    error: {},
};

describe('Subscriptions Confirmed Controller', () => {
    it('should render confirmed page if subscribed successfully', () => {
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'list-language': 'test' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('subscription-confirmed', {
                ...i18n['subscription-confirmed'],
            });

        subscriptionConfirmedController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render error page if subscription failed', () => {
        const request = mockRequest(i18n);
        request.user = { userId: '2' };
        request.body = { 'list-language': 'test' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('error', { ...i18n.error });
        subscriptionConfirmedController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to pending subscriptions if there are no cached subscriptions', () => {
        const request = mockRequest(i18n);
        request.user = { userId: '3' };
        request.body = { 'list-language': 'test' };
        const response = {
            render: () => {
                return '';
            },
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('pending-subscriptions?no-subscriptions=true');

        subscriptionConfirmedController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render list language type error page if no list language was selected', () => {
        const request = mockRequest(i18n);
        request.user = { userId: '2' };
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/subscription-add-list-language?error=true');
        subscriptionConfirmedController.post(request, response).then(() => {
            responseMock.verify();
        });
    });
});
