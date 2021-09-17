import sinon from 'sinon';
import { Request, Response } from 'express';
import LiveCaseStatusUpdatesController from '../../../main/controllers/LiveCaseStatusUpdatesController';

describe('Live Hearings Controller', () => {
  it('should render live hearings page', () => {
    const liveHearingsController = new LiveCaseStatusUpdatesController();

    const response = {
      render: () => {return '';},
      get: () => {return '';},
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('live-case');

    liveHearingsController.get(request, response);
    responseMock.verify();
  });
});
