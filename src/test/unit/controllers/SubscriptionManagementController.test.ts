import SubscriptionManagementController from '../../../main/controllers/SubscriptionManagementController';
import sinon from 'sinon';
import { Response } from 'express';
import {mockRequest} from '../utils/mockRequest';

const subscriptionManagementController = new SubscriptionManagementController();

describe('Subscription Management Controller', () => {
  it('should render the subscription management page', () => {

    const i18n = {
      'subscription-management': {},
    };

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-management',
      request.i18n.getDataByLanguage(request.lng)['subscription-management']);

    subscriptionManagementController.get(request, response);

    responseMock.verify();
  });
});
