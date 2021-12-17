import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import SubscriptionUrnSearchResultController from '../../../main/controllers/SubscriptionUrnSearchResultController';
import {mockRequest} from '../mocks/mockRequest';
import {HearingService} from '../../../main/service/hearingService';

const subscriptionSearchUrnResultController = new SubscriptionUrnSearchResultController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
sinon.stub(HearingService.prototype, 'getCaseByURN').returns(subscriptionsData);

describe('Subscription Urn Search Result Controller', () => {
  let i18n = {};
  it('should render the search page', () => {

    i18n = {
      'subscription-urn-search': {},
    };

    const response = {
      render: function () {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.query = { 'search-input': '123456789'};
    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['subscription-urn-search-results'],
      searchResults: subscriptionsData,
    };

    responseMock.expects('render').once().withArgs('subscription-urn-search-results', expectedData);

    return subscriptionSearchUrnResultController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
