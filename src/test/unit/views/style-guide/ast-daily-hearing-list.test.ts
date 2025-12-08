import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';

const headingClass = 'govuk-heading-l';
const bodyText = 'govuk-body';
const govukLinkClass = 'govuk-link';
const cell = 'govuk-table__cell';
const tableHeader = 'govuk-table__header';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/astDailyHearingList.json'), 'utf-8');
const jsonData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'AST_DAILY_HEARING_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

let htmlRes: Document;
const PAGE_URL = '/ast-daily-hearing-list?artefactId=abc';

describe('AST Daily List page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(
            'Asylum Support Tribunal Daily Hearing List – Court and Tribunal Hearings – GOV.UK',
            'Could not find the page title'
        );
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains('Asylum Support Tribunal Daily Hearing List');
    });

    it('should display fact link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[4].innerHTML).contains('Find contact details and other information about courts and tribunals');
    });

    it('should display fact link', () => {
        const text = htmlRes.getElementsByClassName(govukLinkClass);
        expect(text[5].getAttribute('href')).eq('https://www.find-court-tribunal.service.gov.uk/');
    });

    it('should display venue', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[5].innerHTML).equals('2nd Floor, Import Building');
        expect(text[6].innerHTML).equals('2 Clove Crescent');
        expect(text[7].innerHTML).equals('London E14 2BE');
    });

    it('should display list date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[8].innerHTML).equals('List for 14 February 2022');
    });

    it('should display list updated date text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[9].innerHTML).equals('Last updated 20 January 2025 at 9:30am');
    });

    it('should display important information heading', () => {
        const text = htmlRes.getElementsByClassName('govuk-details__summary-text');
        expect(text[0].innerHTML).equals('Important information');
    });

    it('should display open justice message', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].innerHTML).contains('Open justice is a fundamental principle of our justice system.');
    });

    it('should display join hearing message', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[11].innerHTML).contains(
            'Asylum Support Tribunal parties and representatives will be informed directly as to the arrangements for hearing cases remotely.'
        );
    });

    it('should display observe hearing link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[12].innerHTML).contains('For more information, please visit');
    });

    it('should display observe hearing link', () => {
        const text = htmlRes.getElementsByClassName(govukLinkClass);
        expect(text[6].getAttribute('href')).eq('https://www.gov.uk/guidance/observe-a-court-or-tribunal-hearing');
    });

    it('should display Appellant header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[0].innerHTML).equals('Appellant');
    });

    it('should display Appeal Reference Number header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[1].innerHTML).equals('Appeal reference number');
    });

    it('should display Case Type header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[2].innerHTML).equals('Case type');
    });

    it('should display Hearing Type header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[3].innerHTML).equals('Hearing type');
    });

    it('should display Hearing time header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[4].innerHTML).equals('Hearing time');
    });

    it('should display Additional Information header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[5].innerHTML).equals('Additional information');
    });

    it('should display Appellant cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[0].innerHTML).equals('Appellant A');
    });

    it('should display Appeal Reference Number cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[1].innerHTML).equals('12345');
    });

    it('should display Case Type cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[2].innerHTML).equals('Case type A');
    });

    it('should display Hearing Type cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[3].innerHTML).equals('Hearing type A');
    });

    it('should display hearing Time cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[4].innerHTML).equals('10:30am');
    });

    it('should display Additional Information cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[5].innerHTML).equals('This is additional information');
    });

    it('should display data source text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[13].innerHTML).contains('Data Source: Prov1');
    });
});
