import SearchOptionsController from '../../../main/controllers/SearchOptionController';
import sinon from 'sinon';
import { Request, Response } from 'express';

describe('Search Option Controller', () => {
  it('should render the search options page', () => {
    const searchOptionsController = new SearchOptionsController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search-option');

    searchOptionsController.get(request, response);

    responseMock.verify();
  });

  it('should render search page if choice is \'search\'', () => {
    const searchOptionsController = new SearchOptionsController();

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'find-choice': 'search'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('search');

    searchOptionsController.post(request, response);

    responseMock.verify();
  });
});
