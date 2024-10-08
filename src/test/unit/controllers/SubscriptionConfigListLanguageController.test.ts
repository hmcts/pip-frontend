import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SubscriptionConfigListLanguageController from '../../../main/controllers/SubscriptionConfigListLanguageController';
import { SubscriptionService } from '../../../main/service/SubscriptionService';

const userId = '1';
const language = 'en';

const subscriptionConfigListLanguageController = new SubscriptionConfigListLanguageController();

const getSubscriptionListLanguage = sinon.stub(SubscriptionService.prototype, 'getUserSubscriptionListLanguage');
getSubscriptionListLanguage.withArgs(userId).resolves(['ENGLISH']);

const i18n = { 'subscription-config-list-language': {} };
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
                ...i18n['subscription-config-list-language'],
                listTypeLanguageSubscriptions: ['ENGLISH'],
                noSelectionError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-config-list-language', expectedData);

            return subscriptionConfigListLanguageController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the Configure List Language subscription page with error', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.query = { error: 'true' };
            request.lng = language;

            const expectedData = {
                ...i18n['subscription-config-list-language'],
                listTypeLanguageSubscriptions: ['ENGLISH'],
                noSelectionError: true,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-config-list-language', expectedData);

            return subscriptionConfigListLanguageController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
