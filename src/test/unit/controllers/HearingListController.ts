import HearingListController from '../../../main/controllers/HearingListController';
import sinon from 'sinon';
import { Request, Response } from 'express';

describe('Hearing list Controller', () => {
  it('should render the list page if the court ID exists', () =>  {
    const hearingListController = new HearingListController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {query: {courtId: 2}, headers: {referer: '/referred-page'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('hearing-list');

    hearingListController.get(request, response);

    responseMock.verify();
  });

  it('should render an error page if a court ID that does not return any results', () =>  {
    const hearingListController = new HearingListController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { query: { courtId: 400}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error');

    hearingListController.get(request, response);

    responseMock.verify();
  });

  it('should render an error page if a court ID is not defined', () =>  {
    const hearingListController = new HearingListController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error');

    hearingListController.get(request, response);

    responseMock.verify();
  });

});
