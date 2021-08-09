import SearchResultsController from '../../../main/controllers/SearchResultsController';
import sinon from 'sinon';
import { Request, Response } from 'express';

describe('Search results Controller', () => {
  it('should render the search results page if input is valid', () => {
    const searchResultsController = new SearchResultsController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {query: {'search-input': 'Aylesbury'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search-results');

    searchResultsController.get(request, response);

    responseMock.verify();
  });

  it('should render an error page if search input does not return any results', () => {
    const searchResultsController = new SearchResultsController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { query: { 'search-input': ''}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error');

    searchResultsController.get(request, response);

    responseMock.verify();
  });
});
