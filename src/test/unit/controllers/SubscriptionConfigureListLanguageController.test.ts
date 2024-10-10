import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SubscriptionConfigureListLanguageController from '../../../main/controllers/SubscriptionConfigureListLanguageController';
import { SubscriptionService } from '../../../main/service/SubscriptionService';
import { PendingSubscriptionsFromCache } from '../../../main/service/PendingSubscriptionsFromCache';

const userId = '1';
const language = 'en';

const subscriptionConfigureListLanguageController = new SubscriptionConfigureListLanguageController();

const getSubscriptionListLanguage = sinon.stub(SubscriptionService.prototype, 'getUserSubscriptionListLanguage');
getSubscriptionListLanguage.withArgs(userId).resolves(['ENGLISH']);

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

const i18n = {
    'subscription-configure-list-language': {},
    error: {},
};
const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;

describe('Configure List Language Subscriptions Controller', () => {
    describe('GET view', () => {
        it('should render the Configure List Language subscription page without error', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.query = { error: 'false' };
            request.lng = language;

            const expectedData = {
                ...i18n['subscription-configure-list-language'],
                listTypeLanguageSubscriptions: ['ENGLISH'],
                noSelectionError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-configure-list-language', expectedData);

            return subscriptionConfigureListLanguageController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
    describe('POST view', () => {
        it('should render confirmed page if subscribed successfully', () => {
            const request = mockRequest(i18n);
            request.user = { userId: '1' };
            request.body = { 'list-language': 'test' };

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs('/subscription-configure-list-confirmed');

            subscriptionConfigureListLanguageController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render subscription Config List Language with error if post data is provided and no selection was select', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.lng = language;
            const expectedData = {
                ...i18n['subscription-configure-list-language'],
                listTypeLanguageSubscriptions: ['ENGLISH'],
                noSelectionError: true,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-configure-list-language', expectedData);

            return subscriptionConfigureListLanguageController.post(request, response).then(() => {
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
            subscriptionConfigureListLanguageController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
