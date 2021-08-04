import HearingListController from '../../../main/controllers/HearingListController';
import sinon from 'sinon';
import { Request, Response } from 'express';

describe('Hearing list Controller', () => {
  test('Check that court ID that exists renders the list page', () =>  {
    const hearingListController = new HearingListController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {query: {courtId: 2}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('hearing-list');

    hearingListController.get(request, response);

    responseMock.verify();
  });

  test('Check that a court ID that does not return any results renders an error page', () =>  {
    const hearingListController = new HearingListController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { query: { courtId: 400}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error');

    hearingListController.get(request, response);

    responseMock.verify();
  });

  test('Check that a court ID is not defined renders an error', () =>  {
    const hearingListController = new HearingListController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error');

    hearingListController.get(request, response);

    responseMock.verify();
  });

});
