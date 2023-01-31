import { CaseEventGlossaryService } from '../../../main/service/caseEventGlossaryService';
import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { CaseEventGlossaryRequests } from '../../../main/resources/requests/caseEventGlossaryRequests';

const caseEventGlossaryService = new CaseEventGlossaryService();
const caseEventGlossaryRequests = CaseEventGlossaryRequests.prototype;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/CaseEventGlossary.json'), 'utf-8');
const caseEventGlossaryData = JSON.parse(rawData);

const stub = sinon.stub(caseEventGlossaryRequests, 'getCaseEventGlossaryList').returns(caseEventGlossaryData);
stub.withArgs().returns(caseEventGlossaryData);

const validStatusDescriptionKeysCount = 26;
const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];
const validCaseEventGlossary = 'Adjourned';
const invalidCaseEventGlossary = 'Bench continue hearing';

describe.skip('Case Event Glossary Service', () => {
    it(`should return object with ${validStatusDescriptionKeysCount} status description keys`, () => {
        return caseEventGlossaryService.generateCaseEventGlossaryObject().then(data => {
            expect(Object.keys(data).length).to.equal(validStatusDescriptionKeysCount);
        });
    });

    it('should have have all letters of the alphabet as keys', () => {
        return caseEventGlossaryService.generateCaseEventGlossaryObject().then(data => {
            expect(Object.keys(data)).to.deep.equal(alphabet);
        });
    });

    it(`should have ${validCaseEventGlossary} key`, () => {
        return caseEventGlossaryService.generateCaseEventGlossaryObject().then(data => {
            expect(validCaseEventGlossary).to.deep.equal(data['A'][1].status);
        });
    });

    it('should not have invalid case event glossary', () => {
        return caseEventGlossaryService.generateCaseEventGlossaryObject().then(data => {
            expect(invalidCaseEventGlossary in data['A']).to.be.false;
        });
    });
});
