import SearchController from '../../../main/controllers/SearchController';
import sinon from 'sinon';
import { Request, Response } from 'express';

describe('Search Controller', () => {
  it('should render the search page', () => {
    const searchController = new SearchController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search');

    searchController.get(request, response);

    responseMock.verify();
  });

  it('should redirect to search results page with input as query', () => {
    const searchController = new SearchController();

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'input-autocomplete': 'test'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('search-results?search-input=test');

    searchController.post(request, response);

    responseMock.verify();
  });
});
