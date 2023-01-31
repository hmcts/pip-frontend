import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { CaseEventGlossaryRequests } from '../../../main/resources/requests/caseEventGlossaryRequests';
const PAGE_URL = '/case-event-glossary?locationId=1#1';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/CaseEventGlossary.json'), 'utf-8');
const caseEventGlossaryData = JSON.parse(rawData);

sinon.stub(CaseEventGlossaryRequests.prototype, 'getCaseEventGlossaryList').returns(caseEventGlossaryData);

describe.skip('Case Event Glossary page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display a back button with the correct value', () => {
        const backLink = htmlRes.getElementsByClassName('govuk-back-link');
        expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
        expect(backLink[0].getAttribute('href')).equal(
            '/live-case-status?locationId=1',
            'Back value does not contain correct link'
        );
    });

    it('should contain the glossary of terms', () => {
        const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(pageHeading[0].innerHTML).contains(
            'Live hearing updates - glossary of terms',
            'Page heading does not exist'
        );
    });

    it('should contain letters that link to case events glossary', () => {
        const alphabeticalLetters = htmlRes.getElementsByClassName('govuk-link--no-visited-state');

        expect(alphabeticalLetters[0].innerHTML).contains('A', 'Alphabetical link is not present');
        expect(alphabeticalLetters[0].getAttribute('href')).equal('#A');
    });

    it('should contain the correct headers', () => {
        const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
        expect(tableHeaders[1].innerHTML).contains('Hearing status', 'Hearing status for the cases');
        expect(tableHeaders[2].innerHTML).contains('Description', 'Description for case status');
    });

    it('should contain the alphabets in rows are present', () => {
        for (let i = 0; i < 4; i++) {
            const letter = String.fromCharCode(65 + i);
            const row = htmlRes.getElementById(letter);
            expect(row.innerHTML).contains(letter);
        }
    });

    it('should have the first cell containing Adjourned', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[0].innerHTML).contains('Adjourned');
        expect(cell[1].innerHTML).contains('The case has been adjourned.');
    });

    it('should have the first cell containing Adjourned with link Id in it', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        const divCell = cell[0].getElementsByClassName('govuk-grid-column');
        expect(cell[0].innerHTML).contains('selector-1');
        expect(divCell[0].innerHTML).contains('1');
    });
});
