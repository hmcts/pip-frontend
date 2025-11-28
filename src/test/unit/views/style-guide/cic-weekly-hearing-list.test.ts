import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';

const headingClass = 'govuk-heading-l';
const bodyText = 'govuk-body';
const tableHeader = 'govuk-table__header';
const cell = 'govuk-table__cell';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/cicWeeklyHearingList.json'), 'utf-8');
const jsonData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'CIC_WEEKLY_HEARING_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

let htmlRes: Document;
const PAGE_URL = '/cic-weekly-hearing-list?artefactId=abc';

describe('CIC Weekly Hearing List page', () => {
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
            'Criminal Injuries Compensation Weekly Hearing List – Court and Tribunal Hearings – GOV.UK',
            'Could not find the page title'
        );
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains('Criminal Injuries Compensation Weekly Hearing List');
    });

    it('should display fact link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[4].innerHTML).contains('Find contact details and other information about courts and tribunals');
    });

    it('should display fact link', () => {
        const text = htmlRes.getElementsByClassName('govuk-link');
        expect(text[5].getAttribute('href')).eq('https://www.find-court-tribunal.service.gov.uk/');
    });

    it('should display list date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[5].innerHTML).contains('List for week commencing 14 February 2022');
    });

    it('should display list updated date text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[6].innerHTML).contains('Last updated 20 January 2025 at 9:30am');
    });

    it('should display important information heading', () => {
        const text = htmlRes.getElementsByClassName('govuk-details__summary-text');
        expect(text[0].innerHTML).contains('Important information');
    });

    it('should display important information message line 1', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[7].innerHTML).contains('Open justice is a fundamental principle of our justice system.');
    });

    it('should display important information message line 2', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[8].innerHTML).contains(
            'When considering the use of telephone and video technology, the judiciary will have regard to the principles of open justice.'
        );
    });

    it('should display important information message line 3', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[9].innerHTML).contains(
            'Criminal Injuries Compensation Tribunal parties and representatives will be informed directly as to the arrangements for hearing cases remotely.'
        );
    });

    it('should display restricted reporting orders message', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[11].innerHTML).contains(
            'The inclusion of a case in the Press List is no guarantee that it is not subject to a restricted reporting order.'
        );
    });

    it('should display observe hearing link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[12].innerHTML).contains('https://www.gov.uk/guidance/observe-a-court-or-tribunal-hearing');
    });

    it('should display Date header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[0].innerHTML).equals('Date');
    });

    it('should display Hearing Time header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[1].innerHTML).equals('Hearing time');
    });

    it('should display Case Reference Number header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[2].innerHTML).equals('Case reference number');
    });

    it('should display Case Name header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[3].innerHTML).equals('Case name');
    });

    it('should display Venue header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[4].innerHTML).equals('Venue/Platform');
    });

    it('should display Judges(s) header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[5].innerHTML).equals('Judge(s)');
    });

    it('should display Member(s) header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[6].innerHTML).equals('Member(s)');
    });

    it('should display Additional Information header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[7].innerHTML).equals('Additional information');
    });

    it('should display Date cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[0].innerHTML).equals('26 June 2025');
    });

    it('should display Hearing Time cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[1].innerHTML).equals('10am');
    });

    it('should display Case Reference Number cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[2].innerHTML).equals('1234');
    });

    it('should display Case Name cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[3].innerHTML).equals('This is a case name');
    });

    it('should display Venue cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[4].innerHTML).contains('This is a venue name');
    });

    it('should display Judge(s) cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[5].innerHTML).equals('Judge A');
    });

    it('should display Member(s) cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[6].innerHTML).equals('Member A');
    });

    it('should display Additional information cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[7].innerHTML).contains('This is additional information');
    });

    it('should display data source text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[13].innerHTML).contains('Data Source: Prov1');
    });
});
