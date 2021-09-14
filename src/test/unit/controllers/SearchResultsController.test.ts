import SearchResultsController from '../../../main/controllers/SearchResultsController';
import sinon from 'sinon';
import { Request, Response } from 'express';
import {PipApi} from '../../../main/utils/PipApi';
import fs from 'fs';
import path from 'path';

const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);

const searchResultsController = new SearchResultsController(api);

const stub = sinon.stub(api, 'getCourtList');
describe('Search results Controller', () => {
  it('should render the search results page if input is valid', () => {

    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData);

    stub.withArgs('Abergavenny').returns(hearingsData);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {query: {'search-input': 'Abergavenny'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search-results');


    return searchResultsController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render an error page if search input does not return any results', () => {

    stub.withArgs('').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { query: { 'search-input': ''}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error');

    return searchResultsController.get(request, response).then(() => {
      responseMock.verify();
    });

  });

});
