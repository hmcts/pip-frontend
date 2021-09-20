import sinon from 'sinon';
import { Request, Response } from 'express';
import LiveCaseCourtSearchController from '../../../main/controllers/LiveCaseCourtSearchController';

describe('Live Case Court Search Controller', () => {
  it('should render live cases alphabetical page', () => {
    const liveCaseCourtSearchController = new LiveCaseCourtSearchController();

    const response = {
      render: () => {return '';},
      get: () => {return '';},
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('live-case-alphabet-search');

    liveCaseCourtSearchController.get(request, response);
    responseMock.verify();
  });
});
