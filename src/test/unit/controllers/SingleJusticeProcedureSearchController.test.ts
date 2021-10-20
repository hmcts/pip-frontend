import sinon from 'sinon';
import { Request, Response } from 'express';
import SingleJusticeProcedureSearchController from '../../../main/controllers/SingleJusticeProcedureSearchController';

describe('Single Justice Procedure Search Controller', () => {
  it('should render the subscription management page', () => {
    const singleJusticeProcedureSearchController = new SingleJusticeProcedureSearchController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('single-justice-procedure-search');

    singleJusticeProcedureSearchController.get(request, response);

    responseMock.verify();
  });

});
