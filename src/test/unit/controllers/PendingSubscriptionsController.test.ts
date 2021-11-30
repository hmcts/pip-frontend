import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import {SubscriptionService} from '../../../main/service/subscriptionService';
import {mockRequest} from '../mocks/mockRequest';
import PendingSubscriptionsController from '../../../main/controllers/PendingSubscriptionsController';

const pendingSubscriptionController = new PendingSubscriptionsController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
sinon.stub(SubscriptionService.prototype, 'getPendingSubscriptions').returns(subscriptionsData);

const i18n = {
  'pending-subscriptions': {},
};
const response = {
  render: function () {
    return '';
  },
} as unknown as Response;
const request = mockRequest(i18n);
const responseMock = sinon.mock(response);

describe('Pending Subscriptions Controller', () => {
  it('should render the pending subscription page', () => {
    const expectedData = {
      ...i18n['pending-subscriptions'],
      searchInput : null,
      searchResults: subscriptionsData,
    };

    responseMock.expects('render').once().withArgs('pending-subscriptions', expectedData);

    return pendingSubscriptionController.get(request, response).then(() => {
      responseMock.verify();
    });
  });


  it('should redirect to confirmation page if cases selected is multiple', async () => {
    const request = mockRequest(i18n);
    request.body = {'hearing-selections[]':['1', '10']};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('pending-subscriptions');
    await pendingSubscriptionController.post(request, response);
    return responseMock.verify();
  });

  it('should redirect to confirmation page if cases selected is one', async () => {
    const request = mockRequest(i18n);
    request.body = {'hearing-selections[]':'1'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('pending-subscriptions');
    await pendingSubscriptionController.post(request, response);
    return responseMock.verify();
  });
});
