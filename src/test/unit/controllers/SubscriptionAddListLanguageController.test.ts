import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SubscriptionAddListLanguageController from '../../../main/controllers/SubscriptionAddListLanguageController';
import { PendingSubscriptionsFromCache } from '../../../main/service/PendingSubscriptionsFromCache';

const userId = '1';
const language = 'en';

const subscriptionAddListLanguageController = new SubscriptionAddListLanguageController();
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
cacheStub.withArgs(userId, 'courts').resolves(['cached court']);
cacheStub.withArgs(userId, 'listTypes').resolves(['list type']);

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
            responseMock.expects('redirect').once().withArgs('/subscription-confirmation-preview');

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
    });
});
