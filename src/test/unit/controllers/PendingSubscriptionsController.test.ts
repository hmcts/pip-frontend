import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import {SubscriptionService} from '../../../main/service/subscriptionService';
import {mockRequest} from '../mocks/mockRequest';
import PendingSubscriptionsController from '../../../main/controllers/PendingSubscriptionsController';

const subscriptionConfirmationController = new PendingSubscriptionsController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
sinon.stub(SubscriptionService.prototype, 'getPendingSubscriptions').returns(subscriptionsData);

describe('Pending Subscriptions Controller', () => {
  let i18n = {};
  it('should render the search page', () => {

    i18n = {
      'pending-subscriptions': {},
    };

    const response = {
      render: function () {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['pending-subscriptions'],
      searchInput : null,
      searchResults: subscriptionsData,
    };

    responseMock.expects('render').once().withArgs('pending-subscriptions', expectedData);

    return subscriptionConfirmationController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
