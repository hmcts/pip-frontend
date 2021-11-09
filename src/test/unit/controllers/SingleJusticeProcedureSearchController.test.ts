import sinon from 'sinon';
import { Response } from 'express';
import SingleJusticeProcedureSearchController from '../../../main/controllers/SingleJusticeProcedureSearchController';
import { mockRequest } from '../mocks/mockRequest';
import { SjpRequests } from '../../../main/resources/requests/sjpRequests';
import fs from 'fs';
import path from 'path';

const singleJusticeProcedureSearchController = new SingleJusticeProcedureSearchController();
const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawSJPData).results;
sinon.stub(SjpRequests.prototype, 'getSJPCases').returns(sjpCases);

describe('Single Justice Procedure Search Controller', () => {
  const i18n = {
    'single-justice-procedure-search': {},
  };

  it('should render the subscription management page', async () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['single-justice-procedure-search'],
      casesList: sjpCases,
    };

    responseMock.expects('render').once().withArgs('single-justice-procedure-search', expectedData);

    await singleJusticeProcedureSearchController.get(request, response);
    responseMock.verify();
  });

});
