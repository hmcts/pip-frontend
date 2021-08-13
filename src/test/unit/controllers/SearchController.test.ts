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

  it('should render search page if there are no matching results', () => {
    const searchController = new SearchController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'input-autocomplete': 'test'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search');

    searchController.post(request, response);

    responseMock.verify();
  });

  it('should render search page if input is less than three characters long', () => {
    const searchController = new SearchController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'input-autocomplete': 'aa'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search');

    searchController.post(request, response);

    responseMock.verify();
  });

  it('should redirect to search results page with input as query if input is valid', () => {
    const searchController = new SearchController();

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'input-autocomplete': 'Mutsu Court'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('search-results?search-input=Mutsu Court');

    searchController.post(request, response);

    responseMock.verify();
  });
});
