import SubscriptionManagementController from '../../../main/controllers/SubscriptionManagementController';
import sinon from 'sinon';
import { Request, Response } from 'express';

describe('Subscription Management Controller', () => {
  it('should render the subscription management page', () => {
    const subscriptionManagementController = new SubscriptionManagementController();

    const response = {
      render: () => {return '';},
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management');

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });

  it('should render the subscription management page with all query param', () => {
    const subscriptionManagementController = new SubscriptionManagementController();

    const response = {
      render: () => {return '';},
    } as unknown as Response;
    const request = {query: {all: true}} as unknown as Request;

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management');

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });

  it('should render the subscription management page with case query param', () => {
    const subscriptionManagementController = new SubscriptionManagementController();

    const response = {
      render: () => {return '';},
    } as unknown as Response;
    const request = {query: {case: true}} as unknown as Request;

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management');

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });

  it('should render the subscription management page with court query param', () => {
    const subscriptionManagementController = new SubscriptionManagementController();

    const response = {
      render: () => {return '';},
    } as unknown as Response;
    const request = {query: {court: true}} as unknown as Request;

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management');

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });

});
