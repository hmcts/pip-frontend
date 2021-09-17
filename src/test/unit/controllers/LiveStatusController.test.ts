import sinon from 'sinon';
import { Request, Response } from 'express';
import LiveStatusController from '../../../main/controllers/LiveStatusController';

describe('Live Status Controller', () => {
  const liveStatusController = new LiveStatusController();

  it('should render live updates is court ID exists', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = {query: {courtId: 1}} as unknown as Request;

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('live-status');

    liveStatusController.get(request, response);
    responseMock.verify();
  });

  it('should redirect to not found page if a court ID that does not return any results', () => {
    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = {query: {courtId: 777}} as unknown as Request;

    const responseMock = sinon.mock(response);
    responseMock.expects('redirect').once().withArgs('not-found');

    liveStatusController.get(request, response);
    responseMock.verify();
  });

  it('should render an error page if a court ID is not defined', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('error');

    liveStatusController.get(request, response);
    responseMock.verify();
  });
});
