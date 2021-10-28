import sinon from 'sinon';
import { Response } from 'express';
import CaseNameSearchController from '../../../main/controllers/CaseNameSearchController';
import { mockRequest } from '../mocks/mockRequest';
import { HearingService } from '../../../main/service/hearingService';

const caseNameSearchController = new CaseNameSearchController();
const hearingServiceStub = sinon.stub(HearingService.prototype, 'getHearingsByCaseName');
hearingServiceStub.withArgs('').returns([]);
hearingServiceStub.withArgs('meedoo').returns([{}]);
hearingServiceStub.withArgs('bob').returns([]);

describe('Case name search controller', () => {
  const i18n = {
    'case-name-search': {},
  };

  it('should render case name search page', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {};
    const expectedData = {
      ...i18n['case-name-search'],
    };

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-name-search', expectedData);
    caseNameSearchController.get(request, response);
    responseMock.verify();
  });

  it('should render case name search page if there are search errors', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {error: 'true'};
    const expectedData = {
      ...i18n['case-name-search'],
      noResultsError: true,
    };

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-name-search', expectedData);
    caseNameSearchController.get(request, response);
    responseMock.verify();
  });

  it('should redirect to case name search results page if there are search results', async () => {
    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = {'case-name': 'meedoo'};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('case-name-search-results?search=meedoo');
    return caseNameSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render same page if there are no search results', async () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = {'case-name': 'bob'};
    const expectedData = {
      ...i18n['case-name-search'],
      noResultsError: true,
    };

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-name-search',  expectedData);
    return caseNameSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render same page if there are no search results', async () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = {};
    const expectedData = {
      ...i18n['case-name-search'],
      noResultsError: true,
    };

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-name-search',  expectedData);
    return caseNameSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });
});
