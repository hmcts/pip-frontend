import sinon from 'sinon';
import { Response } from 'express';
import { SubscriptionService } from '../../../main/service/subscriptionService';
import { mockRequest } from '../mocks/mockRequest';
import SubscriptionConfirmedController from '../../../main/controllers/SubscriptionConfirmedController';

const subscriptionConfirmedController = new SubscriptionConfirmedController();
const subscribeStub = sinon.stub(SubscriptionService.prototype, 'subscribe');
subscribeStub.withArgs('1').resolves(true);
subscribeStub.withArgs('2').resolves(false);
const response = {render: () => {return '';}} as unknown as Response;
const i18n = {
  'subscription-confirmed': {},
  'error': {},
};

describe('Subscription Confirmed Controller', () => {
  it('should render confirmed page if subscribed successfully', () => {
    const request = mockRequest(i18n);
    request.user = {id: '1'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-confirmed', {...i18n['subscription-confirmed']});

    subscriptionConfirmedController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render error page if subscription failed', () => {
    const request = mockRequest(i18n);
    request.user = {id: '2'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', {...i18n.error});
    subscriptionConfirmedController.post(request, response).then(() => {
      responseMock.verify();
    });
  });
});
