import sinon from 'sinon';
import { Request, Response } from 'express';
import LiveHearingsController from '../../../main/controllers/LiveHearingsController';

describe('Live Hearings Controller', () => {
  it('should render live hearings page', () => {
    const liveHearingsController = new LiveHearingsController();

    const response = {
      render: () => {return '';},
      get: () => {return '';},
      set: () => {return '';},
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('live-hearings');

    liveHearingsController.get(request, response);
    responseMock.verify();
  });
});
