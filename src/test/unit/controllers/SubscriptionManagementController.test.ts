import SubscriptionManagementController from '../../../main/controllers/SubscriptionManagementController';
import sinon from 'sinon';
import { Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    displayName: string;
  };
}

describe('Subscription Management Controller', () => {
  it('should render the subscription management page', () => {
    const subscriptionManagementController = new SubscriptionManagementController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {user: {displayName: "abcd"}} as unknown as AuthenticatedRequest;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-management');

    subscriptionManagementController.get(request, response);

    responseMock.verify();
  });

});
