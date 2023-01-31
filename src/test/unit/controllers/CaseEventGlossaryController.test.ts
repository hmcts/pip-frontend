import sinon from 'sinon';
import { Response } from 'express';
import CaseEventGlossaryController from '../../../main/controllers/CaseEventGlossaryController';
import fs from 'fs';
import path from 'path';
import { CaseEventGlossaryService } from '../../../main/service/caseEventGlossaryService';
import { mockRequest } from '../mocks/mockRequest';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/CaseEventGlossary.json'), 'utf-8');
const caseEventGlossaryData = JSON.parse(rawData);
const caseEventGlossaryController = new CaseEventGlossaryController();

sinon.stub(CaseEventGlossaryService.prototype, 'generateCaseEventGlossaryObject').resolves(caseEventGlossaryData);

const i18n = {
    'case-event-glossary': {},
};

describe.skip('Case Event Glossary Controller', () => {
    it('should render the case event glossary page', () => {
        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);

        request.query = { locationId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['case-event-glossary'],
            statusList: caseEventGlossaryData,
            locationId: '1',
        };

        responseMock.expects('render').once().withArgs('case-event-glossary', expectedData);

        return caseEventGlossaryController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
});
