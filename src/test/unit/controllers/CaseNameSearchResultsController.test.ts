import sinon from 'sinon';
import { Request, Response } from 'express';
import { PipApi } from '../../../main/utils/PipApi';
import CaseNameSearchResultsController from '../../../main/controllers/CaseNameSearchResultsController';

const axios = require('axios');
const caseNameSearchResultsController = new CaseNameSearchResultsController(new PipApi(axios));

describe('Case name search results controller', () => {
  it('should render case name search results page if query param is valid', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = {query: {search: 'Meedoo'}} as unknown as Request;
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-name-search-results');
    caseNameSearchResultsController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render erro page is query param is invalid', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = {query: {search: ''}} as unknown as Request;
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error');
    caseNameSearchResultsController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
