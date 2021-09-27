import sinon from 'sinon';
import { Request, Response } from 'express';
import SubscriptionAddController from '../../../main/controllers/SubscriptionAddController';

describe('Subscription Add Controller', () => {
  it('should render the subscription add page', () => {
    const subscriptionAddController = new SubscriptionAddController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-add');

    subscriptionAddController.get(request, response);

    responseMock.verify();
  });

  it('should pass through error state if error query param is set', () => {
    const subscriptionAddController = new SubscriptionAddController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {query: {error: 'true'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-add', {selectionError: true});

    subscriptionAddController.get(request, response);

    responseMock.verify();
  });

  it('should render home page if choice is \'case-reference\'', () => {
    const subscriptionAddController = new SubscriptionAddController();

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'subscription-choice': 'case-reference'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/');

    subscriptionAddController.post(request, response);

    responseMock.verify();
  });

  it('should render home page if choice is \'urn\'', () => {
    const subscriptionAddController = new SubscriptionAddController();

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'subscription-choice': 'urn'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/');

    subscriptionAddController.post(request, response);

    responseMock.verify();
  });


  it('should render home page if choice is \'name\'', () => {
    const subscriptionAddController = new SubscriptionAddController();

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'subscription-choice': 'name'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/');

    subscriptionAddController.post(request, response);

    responseMock.verify();
  });

  it('should render home page if choice is \'court-or-tribunal\'', () => {
    const subscriptionAddController = new SubscriptionAddController();

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'subscription-choice': 'court-or-tribunal'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/');

    subscriptionAddController.post(request, response);

    responseMock.verify();
  });

  it('should remain on page and pass error state if no option is selected', () => {
    const subscriptionAddController = new SubscriptionAddController();

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'subscription-choice': ''}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/subscription-add?error=true');

    subscriptionAddController.post(request, response);

    responseMock.verify();
  });

});
