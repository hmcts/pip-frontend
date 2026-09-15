import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';

const headingClass = 'govuk-heading-l';
const bodyText = 'govuk-body';
const cell = 'govuk-table__cell';
const tableHeader = 'govuk-table__header';

const rawData = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/businessAndPropertyDivisionRollsBuildingDailyCauseList.json'),
    'utf-8'
);
const jsonData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'BUSINESS_AND_PROPERTY_DIVISION_ROLLS_BUILDING_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

let htmlRes: Document;
const PAGE_URL = '/business-and-property-division-rolls-building-daily-cause-list?artefactId=abc';

describe('Business and Property Division Rolls Building Daily Cause List page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains('Business and Property Division Rolls Building Daily Cause List');
    });

    it('should display fact link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[4].innerHTML).contains('Find contact details and other information about courts and tribunals');
    });

    it('should display fact link', () => {
        const text = htmlRes.getElementsByClassName('govuk-link');
        expect(text[5].getAttribute('href')).eq('https://www.find-court-tribunal.service.gov.uk/');
    });

    it('should display venue', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[5].innerHTML).equals('Rolls Building');
        expect(text[6].innerHTML).equals('Fetter Lane, London');
        expect(text[7].innerHTML).equals('EC4A 1NL');
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

    it('should display important information message', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].innerHTML).contains(
            'These lists are subject to change until 4:30pm. Any alterations after this time will be telephoned or emailed direct to the parties or their legal representatives.'
        );
    });

    it('should display Remote hearings header', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[11].innerHTML).contains('Remote Hearings');
    });

    it('should display Contact details header', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[13].innerHTML).contains('Contact details');
    });

    it('should display Remote Judgments header', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[25].innerHTML).contains('Remote Judgments');
    });

    it('should display header for Appeal List section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[1].innerHTML).contains('Appeal List');
    });

    it('should display header for Business List section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[2].innerHTML).contains('Business List');
    });

    it('should display header for Commercial Court section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[3].innerHTML).contains('Commercial Court');
    });

    it('should display header for Financial List section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[4].innerHTML).contains('Financial List');
    });

    it('should display header for Insolvency and Companies Court section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[5].innerHTML).contains('Insolvency and Companies Court');
    });

    it('should display header for Intellectual Property and Enterprise Court section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[6].innerHTML).contains('Intellectual Property and Enterprise Court');
    });

    it('should display header for Intellectual Property List section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[7].innerHTML).contains('Intellectual Property List');
    });

    it('should display header for London Circuit Commercial Court section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[8].innerHTML).contains('London Circuit Commercial Court');
    });

    it('should display header for Patents Court section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[9].innerHTML).contains('Patents Court');
    });

    it('should display header for Property, Trusts and Probate List section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[10].innerHTML).contains('Property, Trusts and Probate List');
    });

    it('should display header for Technology and Construction Court section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[11].innerHTML).contains('Technology and Construction Court');
    });

    it('should display header for Admiralty Court section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[12].innerHTML).contains('Admiralty Court');
    });

    it('should display header for Companies Winding Up section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[13].innerHTML).contains('Companies Winding Up');
    });

    it('should display header for Competition List section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[14].innerHTML).contains('Competition List');
    });

    it('should display header for Pensions List section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[15].innerHTML).contains('Pensions List');
    });

    it('should display header for Revenue List section', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[16].innerHTML).contains('Revenue List');
    });

    it('should display Judge table header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[0].innerHTML).equals('Judge');
    });

    it('should display Time table header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[1].innerHTML).equals('Time');
    });

    it('should display Venue table header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[2].innerHTML).equals('Venue');
    });

    it('should display Type table header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[3].innerHTML).equals('Type');
    });

    it('should display Case Number table header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[4].innerHTML).equals('Case number');
    });

    it('should display Case Name table header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[5].innerHTML).equals('Case name');
    });

    it('should display Additional Information table header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[6].innerHTML).equals('Additional information');
    });

    it('should display Judge cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        console.log(cellText[1].innerHTML);
        expect(cellText[0].innerHTML).equals('Judge name');
    });

    it('should display Time cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[1].innerHTML).equals('10:30am');
    });

    it('should display Venue cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[2].innerHTML).equals('This is venue name');
    });

    it('should display Type cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[3].innerHTML).equals('This is hearing type');
    });

    it('should display Case Number cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[4].innerHTML).equals('1234');
    });

    it('should display Case Name cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[5].innerHTML).equals('This is case name');
    });

    it('should display Additional Information cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[6].innerHTML).equals('This is additional information');
    });

    it('should display No hearings scheduled text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[28].innerHTML).contains('No hearings scheduled for this day.');
    });

    it('should display data source text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[29].innerHTML).contains('Data Source: Prov1');
    });
});
