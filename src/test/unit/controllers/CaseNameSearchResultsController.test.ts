import sinon from 'sinon';
import { Response } from 'express';
import CaseNameSearchResultsController from '../../../main/controllers/CaseNameSearchResultsController';
import { HearingService } from '../../../main/service/hearingService';
import { mockRequest } from '../mocks/mockRequest';
import fs from 'fs';
import path from 'path';

const caseNameSearchResultsController = new CaseNameSearchResultsController();
const hearingServiceStub = sinon.stub(HearingService.prototype, 'getHearingsByCaseName');
hearingServiceStub.withArgs('').returns([]);
hearingServiceStub.withArgs('Meedoo').returns([{caseName: 'Meedoo', caseNumber: '321321'}]);

const rawData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/caseHearings.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const stub = sinon.stub(HearingService.prototype, 'getHearingsById');
stub.withArgs(1).returns(subscriptionsData);

describe('Case name search results controller', () => {
  const i18n = {
    'case-name-search-results': {},
  };
  const response = { render: () => {return '';}} as unknown as Response;
  const responseRedirect = { redirect: () => {return '';}} as unknown as Response;

  it('should render case name search results page if query param is valid', async () => {
    const request = mockRequest(i18n);
    request.query = {search: 'Meedoo'};
    const expectedData = {
      ...i18n['case-name-search'],
      searchResults: [{caseName: 'Meedoo', caseNumber: '321321'}],
    };

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-name-search-results', expectedData);
    return caseNameSearchResultsController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render error page is query param is invalid', async () => {
    const request = mockRequest(i18n);
    request.query = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);
    await caseNameSearchResultsController.get(request, response);
    return responseMock.verify();
  });

  it('should redirect to confirmation page if cases selected is multiple', async () => {
    const request = mockRequest(i18n);
    request.body = {'hearing-selections[]':['1', '10']};

    const responseMock = sinon.mock(responseRedirect);

    responseMock.expects('redirect').once().withArgs('pending-subscriptions');
    await caseNameSearchResultsController.post(request, responseRedirect);
    return responseMock.verify();
  });

  it('should redirect to confirmation page if cases selected is one', async () => {
    const request = mockRequest(i18n);
    request.body = {'hearing-selections[]':'1'};

    const responseMock = sinon.mock(responseRedirect);

    responseMock.expects('redirect').once().withArgs('pending-subscriptions');
    await caseNameSearchResultsController.post(request, responseRedirect);
    return responseMock.verify();
  });
});
