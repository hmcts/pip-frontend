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

const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
cacheStub.withArgs(userId, 'listTypes').resolves(['list type']);

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
            request.user = { userId: userId };
            request.body = { 'list-language': 'test' };

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs('/subscription-configure-list-preview');

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
    });
});
