import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import {SubscriptionService} from '../../../main/service/subscriptionService';
import {mockRequest} from '../mocks/mockRequest';
import SubscriptionConfirmationController from '../../../main/controllers/SubscriptionConfirmationController';

const subscriptionConfirmationController = new SubscriptionConfirmationController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
sinon.stub(SubscriptionService.prototype, 'getSubscriptionUrnDetails').returns(subscriptionsData);

describe('Subscription Confirmation Controller', () => {
  let i18n = {};
  it('should render the search page', () => {

    i18n = {
      'subscription-confirmation': {},
    };

    const response = {
      render: function () {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.query = { 'search-input': '123456789', 'stype': 'urn'};
    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['subscription-confirmation'],
      searchInput : '123456789',
      searchResults: subscriptionsData,
    };

    responseMock.expects('render').once().withArgs('subscription-confirmation', expectedData);

    return subscriptionConfirmationController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
