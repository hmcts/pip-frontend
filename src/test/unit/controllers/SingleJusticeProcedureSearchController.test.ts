import sinon from 'sinon';
import {  Response } from 'express';
import SingleJusticeProcedureSearchController from '../../../main/controllers/SingleJusticeProcedureSearchController';
import {mockRequest} from '../mocks/mockRequest';

const singleJusticeProcedureSearchController = new SingleJusticeProcedureSearchController();

describe('Single Justice Procedure Search Controller', () => {
  const i18n = {};
  it('should render the subscription management page', () => {

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('single-justice-procedure-search', request.i18n.getDataByLanguage(request.lng)['single-justice-procedure-search']);

    singleJusticeProcedureSearchController.get(request, response);

    responseMock.verify();
  });

});
