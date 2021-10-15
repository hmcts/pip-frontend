import sinon from 'sinon';
import { Request, Response } from 'express';
import CaseNameSearchController from '../../../main/controllers/CaseNameSearchController';
import { PipApi } from '../../../main/utils/PipApi';

const axios = require('axios');
const api = new PipApi(axios);
const caseNameSearchController = new CaseNameSearchController(api);
const stub = sinon.stub(api, 'filterHearings');

describe('Case name search controller', () => {
  it('should render case name search page', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = {query: {}} as unknown as Request;
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-name-search');
    caseNameSearchController.get(request, response);

    responseMock.verify();
  });

  it('should render case name search page if there are search errors', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = {query: {error: 'true'}} as unknown as Request;
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-name-search', {noResultsError: true});
    caseNameSearchController.get(request, response);

    responseMock.verify();
  });

  it('should redirect to case name search results page if there are search results', () => {
    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = {body: {'case-name': 'Meedoo'}} as unknown as Request;

    stub.withArgs().returns({});
    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('case-name-search-results?search=Meedoo');

    caseNameSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });
});
