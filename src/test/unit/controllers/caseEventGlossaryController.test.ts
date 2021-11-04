import sinon from 'sinon';
import { Response } from 'express';
import CaseEventGlossaryController from '../../../main/controllers/CaseEventGlossaryController';
import fs from 'fs';
import path from 'path';
import {CaseEventGlossaryService} from '../../../main/service/caseEventGlossaryService';
import {mockRequest} from '../mocks/mockRequest';


const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/CaseEventGlossary.json'), 'utf-8');
const caseEventGlossaryData = JSON.parse(rawData);
const caseEventGlossaryController = new CaseEventGlossaryController();

const stub = sinon.stub(CaseEventGlossaryService.prototype, 'generateCourtEventGlossaryObject').returns(caseEventGlossaryData);

describe('Status Description Controller', () => {
  it('should render the status description page', () =>  {
    const i18n = {
      'case-event-glossary': {},
    };

    stub.withArgs(1).returns(caseEventGlossaryData);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {courtId: '1'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('case-event-glossary');

    return caseEventGlossaryController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

});
