import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import SubscriptionUrnSearchResultController from '../../../main/controllers/SubscriptionUrnSearchResultController';
import { mockRequest } from '../mocks/mockRequest';
import { HearingService } from '../../../main/service/hearingService';

const subscriptionSearchUrnResultController = new SubscriptionUrnSearchResultController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const caseStub = sinon.stub(HearingService.prototype, 'getCaseByURN');
caseStub.withArgs('123456789').returns(subscriptionsData);
caseStub.withArgs('foo').returns(null);
const i18n = {
  'subscription-urn-search-results': {},
  error: {},
};

describe('Subscription Urn Search Result Controller', () => {
  it('should render the search result page', async () => {
    const response = {render:  () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = { 'search-input': '123456789'};
    const responseMock = sinon.mock(response);
    const expectedData = {
      ...i18n['pending-subscriptions'],
      searchResults: subscriptionsData,
    };

    responseMock.expects('render').once().withArgs('subscription-urn-search-results', expectedData);
    await subscriptionSearchUrnResultController.get(request, response);
    responseMock.verify();
  });

  it('should render error page if no search input is provided', async () => {
    const response = {render:  () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {'search-input': null};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', {...i18n.error});
    await subscriptionSearchUrnResultController.get(request, response);
    responseMock.verify();
  });

  it('should render error page if invalid search input is provided', async () => {
    const response = {render:  () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {'search-input': 'foo'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', {...i18n.error});
    await subscriptionSearchUrnResultController.get(request, response);
    responseMock.verify();
  });

});
