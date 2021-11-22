import sinon from 'sinon';
import { Response } from 'express';
import CaseReferenceNumberSearchResultController from '../../../main/controllers/CaseReferenceNumberSearchResultController';
import fs from 'fs';
import path from 'path';
import {mockRequest} from '../mocks/mockRequest';
import {HearingRequests} from '../../../main/resources/requests/hearingRequests';

const subscriptionCaseSearchResultController = new CaseReferenceNumberSearchResultController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const allHearingData = JSON.parse(rawData);
const subscriptionsCaseData = allHearingData[0].hearingList[0];
const stub = sinon.stub(HearingRequests.prototype, 'getHearingByCaseReferenceNumber');

const validCaseNo = '56-181-2097';

stub.withArgs(validCaseNo).returns(subscriptionsCaseData);

const response = {
  render: function () {
    return '';
  },
} as unknown as Response;

describe('Subscription Search Case Reference Result Controller', () => {
  const i18n = {};
  it('should render the search result page', () => {

    const request = mockRequest(i18n);
    request.query = { 'search-input': validCaseNo};
    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['case-reference-number-search-results'],
      searchInput : validCaseNo,
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
