import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { SjpRequests } from '../../../main/resources/requests/sjpRequests';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import OldSingleJusticeProcedureController from '../../../main/controllers/OldSingleJusticeProcedureController';

const singleJusticeProcedureController = new OldSingleJusticeProcedureController();
const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawSJPData).results;
sinon.stub(SjpRequests.prototype, 'getSJPCases').resolves(sjpCases);

describe('Single Justice Procedure Controller', () => {
  const i18n = {
    'single-justice-procedure': {},
  };

  it('should render the subscription management page', async () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['single-justice-procedure'],
      casesList: sjpCases,
      published: moment().format('DD MMMM YYYY [at] ha'),
    };

    responseMock.expects('render').once().withArgs('old-single-justice-procedure', expectedData);

    await singleJusticeProcedureController.get(request, response);
    responseMock.verify();
  });

});
