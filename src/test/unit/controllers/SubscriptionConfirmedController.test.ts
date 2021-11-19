import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import {SubscriptionService} from '../../../main/service/subscriptionService';
import {mockRequest} from '../mocks/mockRequest';
import SubscriptionConfirmedController from '../../../main/controllers/SubscriptionConfirmedController';

const subscriptionConfirmedController = new SubscriptionConfirmedController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
sinon.stub(SubscriptionService.prototype, 'getSubscriptionUrnDetails').returns(subscriptionsData);

describe('Subscription Confirmed Controller', () => {
  let i18n = {};
  it('should render the confirmed page', () => {

    i18n = {
      'subscription-confirmed': {},
    };

    const response = {
      render: function () {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-confirmed');

    return subscriptionConfirmedController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
