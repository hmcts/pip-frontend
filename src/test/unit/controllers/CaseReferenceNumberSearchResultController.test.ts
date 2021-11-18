import sinon from 'sinon';
import { Response } from 'express';
import CaseReferenceNumberSearchResultController from '../../../main/controllers/CaseReferenceNumberSearchResultController';
import fs from 'fs';
import path from 'path';
import {mockRequest} from '../mocks/mockRequest';
import {HearingRequests} from '../../../main/resources/requests/hearingRequests';

const subscriptionCaseSearchResultController = new CaseReferenceNumberSearchResultController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionCaseList.json'), 'utf-8');
const subscriptionsCaseData = JSON.parse(rawData);
const stub = sinon.stub(HearingRequests.prototype, 'getHearingByCaseReferenceNumber');
stub.withArgs('ABC12345').returns(subscriptionsCaseData);

describe('Subscription Search Case Reference Result Controller', () => {
  let i18n = {};
  it('should render the search result page', () => {

    i18n = {
      'case-reference-number-search': {},
    };

    const response = {
      render: function () {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.query = { 'search-input': 'ABC12345'};
    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['case-reference-number-search-results'],
      searchInput : 'ABC12345',
      searchResults: subscriptionsCaseData,
    };

    responseMock.expects('render').once().withArgs('case-reference-number-search-results', expectedData);

    return subscriptionCaseSearchResultController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render an error page if search input does not return any results', () => {

    stub.withArgs('12345678').returns(null);

    const i18n = {
      'case-reference-number-search-results': {},
    };

    const response = {
      render: function() {return '';},
    } as unknown as Response;

    const request = mockRequest(i18n);
    request.query = {'search-input': ''};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['error'],
    };

    responseMock.expects('render').once().withArgs('error', expectedData);

    return subscriptionCaseSearchResultController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
