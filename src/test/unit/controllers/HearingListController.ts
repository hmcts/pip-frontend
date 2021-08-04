import HearingListController from "../../../main/controllers/HearingListController";
import sinon from 'sinon';
import { Request, Response } from 'express';

describe('Hearing list Controller', () => {
  test("Check that court ID that exists renders the list page", () =>  {
    let hearingListController = new HearingListController();

    let response = { render: function(page, options) {}} as unknown as Response;
    let request = {query: {courtId: 2}} as unknown as Request;

    let responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('hearing-list')

    hearingListController.get(request, response)

    responseMock.verify();
  });

  test("Check that a court ID that does not return any results renders an error page", () =>  {
    let hearingListController = new HearingListController();

    let response = { render: function(page, options) {}} as unknown as Response;
    let request = { query: { courtId: 400}} as unknown as Request;

    let responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error')

    hearingListController.get(request, response)

    responseMock.verify();
  });

  test("Check that a court ID is not defined renders an error", () =>  {
    let hearingListController = new HearingListController();

    let response = { render: function(page, options) {}} as unknown as Response;
    let request = { query: {}} as unknown as Request;

    let responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error')

    // @ts-ignore
    hearingListController.get(request, response)

    responseMock.verify();
  });

});
