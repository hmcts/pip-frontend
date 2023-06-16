import sinon from 'sinon';
import { Response } from 'express';
import SubscriptionAddController from '../../../main/controllers/SubscriptionAddController';
import { mockRequest } from '../mocks/mockRequest';

const subscriptionAddController = new SubscriptionAddController();

describe('Subscriptions Add Controller', () => {
    const i18n = {};
    it('should render the subscription add page', () => {
        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = {};

        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('subscription-add', request.i18n.getDataByLanguage(request.lng)['subscription-add']);

        subscriptionAddController.get(request, response);

        responseMock.verify();
    });

    it('should pass through error state if error query param is set', () => {
        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { error: 'true' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['subscription-add'],
            selectionError: true,
        };

        responseMock.expects('render').once().withArgs('subscription-add', expectedData);

        subscriptionAddController.get(request, response);

        responseMock.verify();
    });

    it("should render home page if choice is 'case-reference'", () => {
        const response = {
            redirect: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'subscription-choice': 'case-reference' };

        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/case-reference-number-search');

        subscriptionAddController.post(request, response);

        responseMock.verify();
    });

    it("should render case name search page if choice is 'name'", () => {
        const response = {
            redirect: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'subscription-choice': 'name' };

        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/case-name-search');

        subscriptionAddController.post(request, response);

        responseMock.verify();
    });

    it("should render party name search page if choice is 'party-name'", () => {
        const response = {
            redirect: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'subscription-choice': 'party-name' };

        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/party-name-search');

        subscriptionAddController.post(request, response);

        responseMock.verify();
    });

    it("should render home page if choice is 'court-or-tribunal'", () => {
        const response = {
            redirect: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'subscription-choice': 'court-or-tribunal' };

        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/location-name-search');

        subscriptionAddController.post(request, response);

        responseMock.verify();
    });

    it('should remain on page and pass error state if no option is selected', () => {
        const subscriptionAddController = new SubscriptionAddController();

        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'subscription-choice': '' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['subscription-add'],
            selectionError: true,
        };

        responseMock.expects('render').once().withArgs('subscription-add', expectedData);

        subscriptionAddController.post(request, response);

        responseMock.verify();
    });
});
