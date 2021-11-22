import sinon from 'sinon';
import { Response } from 'express';
import CaseReferenceNumberSearchController from '../../../main/controllers/CaseReferenceNumberSearchController';
import fs from 'fs';
import path from 'path';
import {mockRequest} from '../mocks/mockRequest';
import {HearingRequests} from '../../../main/resources/requests/hearingRequests';

const subscriptionCaseSearchController = new CaseReferenceNumberSearchController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const allHearingData = JSON.parse(rawData);
const subscriptionCaseResult = allHearingData[0].hearingList[0];
const stub = sinon.stub(HearingRequests.prototype, 'getHearingByCaseReferenceNumber');

const validCaseNo = '56-181-2097';

describe('Subscription Case Search Controller', () => {
  const i18n = {};
  it('should render the search page', () => {

    const response = {
      render: function () {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['case-reference-number-search'],
    };

    responseMock.expects('render').once().withArgs('case-reference-number-search', expectedData);

    subscriptionCaseSearchController.get(request, response);

    responseMock.verify();
  });

  it('should render case search page if there are no matching results', () => {

    stub.withArgs(validCaseNo).returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': validCaseNo};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-reference-number-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render case search page if input is less than three characters long', () => {

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': '12'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-reference-number-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render case search page if input is three characters long and partially correct', () => {

    stub.withArgs('1234').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': '1234'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-reference-number-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render case search page if no input is provided', () => {

    stub.withArgs('').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': ''};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-reference-number-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should redirect to case search results page with input as query if case number is valid', () => {

    const response = {
      redirect: function() {return '';},
      render: function() {return '';},
    } as unknown as Response;

    const request = mockRequest(i18n);

    request.body = { 'search-input': validCaseNo};

    const responseMock = sinon.mock(response);
    stub.withArgs(validCaseNo).returns(subscriptionCaseResult);

    responseMock.expects('redirect').once().withArgs('case-reference-number-search-results?search-input=56-181-2097');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });
});
