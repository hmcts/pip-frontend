import sinon from 'sinon';
import { Response } from 'express';
import CaseReferenceNumberSearchResultController from '../../../main/controllers/CaseReferenceNumberSearchResultController';
import fs from 'fs';
import path from 'path';
import {mockRequest} from '../mocks/mockRequest';
import {PublicationService} from '../../../main/service/publicationService';
import {UserService} from '../../../main/service/userService';

const caseReferenceNumberSearchResultController = new CaseReferenceNumberSearchResultController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const subscriptionsCaseData = JSON.parse(rawData)[0].hearingList[0];
const stub = sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber');

const validCaseNo = '56-181-2097';

const usStub = sinon.stub(UserService.prototype, 'getPandIUserId');
const profile = {oid: '1234', profile: 'test-profile'};
usStub.withArgs('PI_AAD', profile).returns('123');

stub.withArgs(validCaseNo).returns(subscriptionsCaseData);

const response = {
  render: function () {
    return '';
  },
} as unknown as Response;

describe('Case Reference Number Search Result Controller', () => {
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

    return caseReferenceNumberSearchResultController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render an error page if search input does not return any results', () => {

    const request = mockRequest(i18n);
    request.query = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    return caseReferenceNumberSearchResultController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
