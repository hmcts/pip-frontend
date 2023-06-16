import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { PublicationRequests } from '../../../main/resources/requests/publicationRequests';

const PAGE_URL = '/party-name-search-results?search=name';
let htmlRes: Document;

const data = [
    {
        search: {
            cases: [
                { caseName: 'case name 1', caseNumber: '123', caseUrn: '456' },
                { caseName: 'case name 2', caseNumber: '789', caseUrn: null },
            ],
            parties: [
                {
                    cases: [{ caseName: 'case name 1', caseNumber: '123', caseUrn: '456' }],
                    organisations: [],
                    individuals: [
                        {
                            forename: 'forename',
                            middleName: 'middleName',
                            surname: 'surname',
                        },
                    ],
                },
                {
                    cases: [{ caseName: 'case name 2', caseNumber: '789', caseUrn: null }],
                    organisations: ['org name'],
                    individuals: [],
                },
            ],
        },
    },
];

sinon.stub(PublicationRequests.prototype, 'getPublicationByCaseValue').returns(data);

app.request['user'] = { roles: 'VERIFIED' };

describe('Party name search results page', () => {
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
        expect(pageTitle).contains('Search result', 'Page title does not match');
    });

    it('should display header', () => {
        const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(pageHeading[0].innerHTML).contains('Search result', 'Page heading does not match');
    });

    it('should display results count message', () => {
        const resultsMessage = htmlRes.getElementsByClassName('govuk-body');
        expect(resultsMessage[0].innerHTML).contains('3  result(s) successfully found', 'Results message not found');
    });

    it('should contain expected column headings', () => {
        const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
        expect(tableHeaders[0].innerHTML).contains('Select a result', 'Could not find select a result header');
        expect(tableHeaders[1].innerHTML).contains('Case name', 'Could not find case name header');
        expect(tableHeaders[2].innerHTML).contains('Party name(s)', 'Could not find party names header');
        expect(tableHeaders[3].innerHTML).contains('Reference number', 'Could not find case reference number header');
    });

    it('should contain 4 rows, including the header', () => {
        const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
        expect(tableRows.length).equal(4, 'Number of rows is not equal to expected amount');
    });

    it('should display correct data for able rows', () => {
        const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
        expect(tableRows[1].innerHTML).contains('case name 1', 'Case name incorrect on table row');
        expect(tableRows[1].innerHTML).contains('forename middleName surname', 'Party name incorrect on table row');
        expect(tableRows[1].innerHTML).contains('123', 'Case number incorrect on table row');

        expect(tableRows[2].innerHTML).contains('case name 1', 'Case name incorrect on table row');
        expect(tableRows[2].innerHTML).contains('forename middleName surname', 'Party name incorrect on table row');
        expect(tableRows[2].innerHTML).contains('456', 'Case urn incorrect on table row');

        expect(tableRows[3].innerHTML).contains('case name 2', 'Case name incorrect on table row');
        expect(tableRows[3].innerHTML).contains('org name', 'Party name incorrect on table row');
        expect(tableRows[3].innerHTML).contains('789', 'Case number incorrect on table row');
    });

    it('should display checkboxes', () => {
        const checkBoxes = htmlRes.querySelectorAll('.govuk-table__body .govuk-checkboxes__input');
        expect(checkBoxes.length).equal(3, 'Could not find table checkboxes');
    });
});
