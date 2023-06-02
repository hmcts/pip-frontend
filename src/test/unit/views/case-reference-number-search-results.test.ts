import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';

const searchTerm = '56-181-2097';
const numOfResults = '1';
const resultFound = '1 result successfully found';
const CASE_NUMBER_PAGE_URL = `/case-reference-number-search-results?search-input=${searchTerm}&search-type=case-number`;
const CASE_URN_PAGE_URL = `/case-reference-number-search-results?search-input=${searchTerm}&search-type=case-urn`;

const rowClass = 'govuk-table__row';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const subscriptionsData = { ...JSON.parse(rawData)[0].search.cases[0], partyNames: 'party name' };
sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber').returns(subscriptionsData);
sinon.stub(PublicationService.prototype, 'getCaseByCaseUrn').returns(subscriptionsData);

const pageTitleValue = 'Search result';

app.request['user'] = { roles: 'VERIFIED' };

describe('Case Reference Search Results Page - Number', () => {
    beforeAll(async () => {
        await request(app)
            .get(CASE_NUMBER_PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
    });

    it('should display back button', () => {
        const backButton = htmlRes.getElementsByClassName('govuk-back-link');
        expect(backButton[0].innerHTML).contains('Back', 'Back button does not contain correct text');
        expect(backButton[0].getAttribute('href')).equal('#', 'Back button does not contain correct link');
    });

    it('should list the number of results found', () => {
        const bodyText = htmlRes.getElementsByClassName('govuk-heading-m');
        expect(bodyText[0].innerHTML).contains(resultFound, `Could find ${numOfResults} results in the body`);
    });

    it('should display first table header', () => {
        const tableHeader1 = htmlRes.getElementsByClassName('govuk-table__head');
        expect(tableHeader1[0].innerHTML).contains('Case name', 'Could not find text in first header');
    });

    it('should display second table header', () => {
        const tableHeader2 = htmlRes.getElementsByClassName('govuk-table__head');
        expect(tableHeader2[0].innerHTML).contains('Reference number', 'Could not find text in second header');
    });

    it('should contain 2 rows including the header row', () => {
        const rows = htmlRes.getElementsByClassName(rowClass);
        expect(rows.length).equal(2, 'Table did not contain expected number of rows');
    });

    it('should contain rows with correct values', () => {
        const rows = htmlRes.getElementsByClassName(rowClass);
        const items = rows.item(1).children;

        expect(items[0].innerHTML).contains('case name 1', 'Case number does not exist');
        expect(items[1].innerHTML).contains('party name', 'Party name does not exist');
        expect(items[2].innerHTML).contains('635356', 'Case reference no does not exist');
    });
});

describe('Case Reference Search Results Page - URN', () => {
    beforeAll(async () => {
        await request(app)
            .get(CASE_URN_PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should contain 2 rows including the header row', () => {
        const rows = htmlRes.getElementsByClassName(rowClass);
        expect(rows.length).equal(2, 'Table did not contain expected number of rows');
    });

    it('should contain rows with correct values', () => {
        const rows = htmlRes.getElementsByClassName(rowClass);
        const items = rows.item(1).children;

        expect(items[0].innerHTML).contains('case name 1', 'Case number does not exist');
        expect(items[1].innerHTML).contains('party name', 'Party name does not exist');
        expect(items[2].innerHTML).contains('38543', 'Case urn does not exist');
    });
});
