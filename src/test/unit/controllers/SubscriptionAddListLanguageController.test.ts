import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SubscriptionAddListLanguageController from '../../../main/controllers/SubscriptionAddListLanguageController';
import { SubscriptionService } from '../../../main/service/SubscriptionService';
import { PendingSubscriptionsFromCache } from '../../../main/service/PendingSubscriptionsFromCache';

const userId = '1';
const language = 'en';

const subscriptionAddListLanguageController = new SubscriptionAddListLanguageController();
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
    'subscription-add-list-language': {},
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

describe('Add List Language Subscriptions Controller', () => {
    describe('GET view', () => {
        it('should render the Add List Language subscription page without error', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.lng = language;

            const expectedData = {
                ...i18n['subscription-add-list-language'],
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-add-list-language', expectedData);

            return subscriptionAddListLanguageController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST view', () => {
        it('should redirect subscription confirmation page if post data is provided', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.lng = language;
            request.body = { 'list-language': 'test' };

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs('/subscription-confirmed');

            return subscriptionAddListLanguageController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render subscription Add List Language with error if post data is provided and no selection was select', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.lng = language;
            const expectedData = {
                ...i18n['subscription-add-list-language'],
                noSelectionError: true,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-add-list-language', expectedData);

            return subscriptionAddListLanguageController.post(request, response).then(() => {
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
            subscriptionAddListLanguageController.post(request, response).then(() => {
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

            subscriptionAddListLanguageController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
