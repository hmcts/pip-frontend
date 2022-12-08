import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import SubscriptionUrnSearchResultController from '../../../main/controllers/SubscriptionUrnSearchResultController';
import { mockRequest } from '../mocks/mockRequest';
import {PublicationService} from '../../../main/service/publicationService';

const subscriptionSearchUrnResultController = new SubscriptionUrnSearchResultController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData)[0].search.cases[0];
const caseStub = sinon.stub(PublicationService.prototype, 'getCaseByCaseUrn');
caseStub.withArgs('123456789').returns(subscriptionsData);
caseStub.withArgs('foo').returns(null);

describe('Subscriptions Urn Search Result Controller', () => {
  let i18n = {};
  it('should render the search result page', async () => {

    i18n = {
      'subscription-urn-search-results': {},
    };

    const response = {
      render: function () {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {'search-input': '123456789'};
    request.user = {userId: '1'};
    const responseMock = sinon.mock(response);
    const expectedData = {
      ...i18n['subscription-urn-search-results'],

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
    request.user = {userId: '1'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);
    await subscriptionSearchUrnResultController.get(request, response);
    responseMock.verify();
  });

  it('should render error page if invalid search input is provided', async () => {
    const response = {render:  () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {'search-input': 'foo'};
    request.user = {userId: '1'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);
    await subscriptionSearchUrnResultController.get(request, response);
    responseMock.verify();
  });

});
