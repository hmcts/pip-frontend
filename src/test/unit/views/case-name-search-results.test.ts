import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { PublicationRequests } from '../../../main/resources/requests/publicationRequests';

const PAGE_URL = '/case-name-search-results?search=Meedo';
const pageTitleValue = 'Search result';
let htmlRes: Document;

const data = [
    {
        search: {
            cases: [
                { caseName: "Meedoo's hearings", caseNumber: '123' },
                { caseName: "Meedoo's hearings", caseNumber: '321', caseUrn: 'caseUrn1234' },
                { caseName: "Meedoo's hearings", caseNumber: '234' },
                { caseName: "Meedoo's hearings", caseNumber: '534' },
                { caseName: "Meedoo's hearings", caseNumber: '674' },
            ],
        },
    },
];

sinon.stub(PublicationRequests.prototype, 'getPublicationByCaseValue').returns(data);

app.request['user'] = { roles: 'VERIFIED' };

describe('Case name search results page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
    });

    it('should display header', () => {
        const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(pageHeading[0].innerHTML).contains('Search result', 'Page heading does not exist');
    });

    it('should display results count message', () => {
        const resultsMessage = htmlRes.getElementsByClassName('govuk-body');
        expect(resultsMessage[0].innerHTML).contains('6  result(s) successfully found', 'Results message not found');
    });

    it('should contain expected column headings', () => {
        const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
        expect(tableHeaders[0].innerHTML).contains('Select a result', 'Could not find select a result header');
        expect(tableHeaders[1].innerHTML).contains('Case name', 'Could not find case name header');
        expect(tableHeaders[2].innerHTML).contains('Party name(s)', 'Could not find party names header');
        expect(tableHeaders[3].innerHTML).contains('Reference number', 'Could not find case reference number header');
    });

    it('should contain 7 rows, including the header', () => {
        const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
        expect(tableRows.length).equal(7, 'Number of rows is not equal to expected amount');
    });

    it('should display correct data for case number row', () => {
        const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
        expect(tableRows[1].innerHTML).contains("Meedoo's hearings", 'Case name incorrect on table row');
        expect(tableRows[1].innerHTML).contains('123', 'Case number incorrect on table row');
    });

    it('should display correct data for case urn row', () => {
        const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
        expect(tableRows[3].innerHTML).contains("Meedoo's hearings", 'Case name incorrect on table row');
        expect(tableRows[3].innerHTML).contains('caseUrn1234', 'Case urn incorrect on table row');
    });

    it('should display checkboxes', () => {
        const checkBoxes = htmlRes.querySelectorAll('.govuk-table__body .govuk-checkboxes__input');
        expect(checkBoxes.length).equal(6, 'Could not find table checkboxes');
    });
});
