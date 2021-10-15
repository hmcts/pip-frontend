import SearchOptionsController from '../../../main/controllers/SearchOptionController';
import sinon from 'sinon';
import { Response } from 'express';
import {mockRequest} from '../utils/mockRequest';

const searchOptionsController = new SearchOptionsController();
describe('Search Option Controller', () => {
  let i18n = {};
  it('should render the search options page', () => {

    i18n = {
      'search-option': {},
    };

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search-option', request.i18n.getDataByLanguage(request.lng)['search-option']);

    searchOptionsController.get(request, response);

    responseMock.verify();
  });

  it('should render search page if choice is \'search\'', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'find-choice': 'search'};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('search');

    searchOptionsController.post(request, response);

    responseMock.verify();
  });

  it('should render alphabetical page if choice is \'find\'', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'find-choice': 'find'};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('alphabetical-search');

    searchOptionsController.post(request, response);

    responseMock.verify();
  });

  it('should render same page if nothing selected', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'find-choice': ''};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('search-option');

    searchOptionsController.post(request, response);

    responseMock.verify();
  });
});
