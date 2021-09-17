import sinon from 'sinon';
import { Request, Response } from 'express';
import LiveCaseStatusUpdatesController from '../../../main/controllers/LiveCaseStatusUpdatesController';

describe('Live Case Status Controller', () => {
  it('should render live hearings page', () => {
    const liveCaseStatusUpdatesController = new LiveCaseStatusUpdatesController();

    const response = {
      render: () => {return '';},
      get: () => {return '';},
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('live-case');

    liveCaseStatusUpdatesController.get(request, response);
    responseMock.verify();
  });
});
