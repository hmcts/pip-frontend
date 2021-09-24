import SubscriptionManagementController from '../../../main/controllers/SubscriptionManagementController';
import sinon from 'sinon';
import { Request, Response } from 'express';

describe('Subscription Management Controller', () => {
  it('should render the subscription management page', () => {
    const subscriptionManagementController = new SubscriptionManagementController();

    const response = {
      render: () => {return '';}
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management');

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });

});
