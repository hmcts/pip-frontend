import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SubscriptionAddListLanguageController from '../../../main/controllers/SubscriptionAddListLanguageController';

const userId = '1';
const language = 'en';

const subscriptionAddListLanguageController = new SubscriptionAddListLanguageController();

const i18n = { 'subscription-add-list-language': {} };
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
            request.query = { error: 'false' };
            request.lng = language;

            const expectedData = {
                ...i18n['subscription-add-list-language'],
                noSelectionError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-add-list-language', expectedData);

            return subscriptionAddListLanguageController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the Add List Language subscription page with error', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.query = { error: 'true' };
            request.lng = language;

            const expectedData = {
                ...i18n['subscription-add-list-language'],
                noSelectionError: true,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-add-list-language', expectedData);

            return subscriptionAddListLanguageController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});