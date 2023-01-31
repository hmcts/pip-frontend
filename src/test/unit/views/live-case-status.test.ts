import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { LiveCaseRequests } from '../../../main/resources/requests/liveCaseRequests';

const PAGE_URL = '/live-case-status?locationId=1';
const expectedHeader = 'Live hearing updates';
const expectedCourtName = 'Mutsu Court';
let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/liveCaseStatusUpdates.json'), 'utf-8');
const liveCaseData = JSON.parse(rawData).results;

sinon.stub(LiveCaseRequests.prototype, 'getLiveCases').returns(liveCaseData);

describe.skip('Live Status page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display a back button', () => {
        const backLink = htmlRes.getElementsByClassName('govuk-back-link');
        expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
    });

    it('should display correct header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should display correct court name', () => {
        const courtName = htmlRes.getElementsByClassName('govuk-heading-m');
        expect(courtName[0].innerHTML).contains(expectedCourtName, 'could not find the court name header');
    });

    it('should contain expected column headings', () => {
        const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
        expect(tableHeaders[0].innerHTML).contains('Court number', 'Could not find court number header');
        expect(tableHeaders[1].innerHTML).contains('Case number', 'Could not find case number header');
        expect(tableHeaders[2].innerHTML).contains('Case name', 'Could not find case name header');
        expect(tableHeaders[3].innerHTML).contains('Status', 'Could not find status header');
    });

    it('should contain 5 rows, including the header', () => {
        const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
        expect(tableRows.length).equal(5, 'Number of rows is not equal to expected amount');
    });

    it('should contain a row with the correct values', () => {
        const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
        const items = tableRows.item(1).children;
        const statusColumnValue =
            'Committal for Sentence - <br><a class="govuk-link" id="status-1" href="case-event-glossary?locationId=1#2">Appeal Interpreter Sworn</a> - 12:25';

        expect(items.item(0).innerHTML).contains('1', 'Court Number not found / correct');
        expect(items.item(1).innerHTML).contains('T20217099', 'Case number not found / correct');
        expect(items.item(2).innerHTML).contains("Mills LLC's Hearing", 'Case name not found / correct');
        expect(items.item(3).innerHTML).contains(statusColumnValue, 'Status not found / correct');
    });

    it('should contain a row with no information', () => {
        const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
        const items = tableRows.item(2).children;

        expect(items.item(0).innerHTML).contains('', 'Court Number not found / correct');
        expect(items.item(1).innerHTML).contains('', 'Case number not found / correct');
        expect(items.item(2).innerHTML).contains('', 'Case name not found / correct');
        expect(items.item(3).innerHTML).contains('- No Information To Display', 'Status not found / correct');
    });

    it('should display the link to go back to live case alphabet list', () => {
        const link = htmlRes.getElementsByClassName('govuk-link');

        expect(link.item(6).innerHTML).contains('See another court or tribunal', 'Link text is not present');
        expect(link.item(6).getAttribute('href')).equal('/live-case-alphabet-search', 'Link value is not correct');
    });
});
