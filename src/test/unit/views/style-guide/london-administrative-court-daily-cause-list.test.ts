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
    path.resolve(__dirname, '../../mocks/londonAdministrativeCourtDailyCauseList.json'),
    'utf-8'
);
const jsonData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'LONDON_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

let htmlRes: Document;
const PAGE_URL = '/london-administrative-court-daily-cause-list?artefactId=abc';

describe('London Administrative Court Daily Cause Listpage', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains('London Administrative Court Daily Cause List');
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
        expect(text[5].innerHTML).equals('Royal Courts of Justice');
        expect(text[6].innerHTML).equals('Strand, London');
        expect(text[7].innerHTML).equals('WC2A 2LL');
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

    it('should display important information message 1', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].innerHTML).contains(
            'Hearings take place in public unless otherwise indicated. ' +
                'When considering the use of telephone and video technology the ' +
                'judiciary will have regard to the principles of open justice. ' +
                'The court may exclude observers where necessary to secure the proper administration of justice.'
        );
    });

    it('should display Judgments heading', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[11].innerHTML).contains('Judgments');
    });

    it('should display important information message 2', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[12].innerHTML).contains(
            'Judgments handed down by the judge remotely will be released by circulation to the parties’ ' +
                'representatives by email and release to the National Archives. The date and time ' +
                'for hand-down will be deemed to be not before time listed. A copy of the judgment ' +
                'in final form as handed down can be made available after that time, on request by email.'
        );
    });

    it('should display Venue header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[0].innerHTML).equals('Venue');
    });

    it('should display Judge header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[1].innerHTML).equals('Judge');
    });

    it('should display Time header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[2].innerHTML).equals('Time');
    });

    it('should display Case Number header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[3].innerHTML).equals('Case number');
    });

    it('should display Case Details header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[4].innerHTML).equals('Case details');
    });

    it('should display Hearing Type header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[5].innerHTML).equals('Hearing type');
    });

    it('should display Additional Information header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[6].innerHTML).equals('Additional information');
    });

    it('should display Venue header for planning court', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[7].innerHTML).equals('Venue');
    });

    it('should display Judge header for planning court', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[8].innerHTML).equals('Judge');
    });

    it('should display Time header for planning court', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[9].innerHTML).equals('Time');
    });

    it('should display Case Number header for planning court', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[10].innerHTML).equals('Case number');
    });

    it('should display Case Details header for planning court', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[11].innerHTML).equals('Case details');
    });

    it('should display Hearing Type header for planning court', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[12].innerHTML).equals('Hearing type');
    });

    it('should display Additional Information header for planning court', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[13].innerHTML).equals('Additional information');
    });

    it('should display Venue cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[0].innerHTML).equals('Venue A');
    });

    it('should display Judge cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[1].innerHTML).equals('Judge A');
    });

    it('should display Time cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[2].innerHTML).equals('9am');
    });

    it('should display Case Number cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[3].innerHTML).equals('12345');
    });

    it('should display Case Details cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[4].innerHTML).equals('Case details A');
    });

    it('should display Hearing Type cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[5].innerHTML).equals('Hearing type A');
    });

    it('should display Additional Information cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[6].innerHTML).equals('This is additional information');
    });

    it('should display Venue cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[7].innerHTML).equals('Venue B');
    });

    it('should display Judge cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[8].innerHTML).equals('Judge B');
    });

    it('should display Time cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[9].innerHTML).equals('10:30am');
    });

    it('should display Case Number cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[10].innerHTML).equals('12346');
    });

    it('should display Case Details cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[11].innerHTML).equals('Case details B');
    });

    it('should display Hearing Type cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[12].innerHTML).equals('Hearing type B');
    });

    it('should display Additional Information cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[13].innerHTML).equals('This is another additional information');
    });

    it('should display planning court heading', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[1].innerHTML).contains('Planning Court');
    });

    it('should display Venue cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[14].innerHTML).equals('Venue A');
    });

    it('should display Judge cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[15].innerHTML).equals('Judge A');
    });

    it('should display Time cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[16].innerHTML).equals('9am');
    });

    it('should display Case Number cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[17].innerHTML).equals('12345');
    });

    it('should display Case Details cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[18].innerHTML).equals('Case details A');
    });

    it('should display Hearing Type cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[19].innerHTML).equals('Hearing type A');
    });

    it('should display Additional Information cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[20].innerHTML).equals('This is additional information');
    });

    it('should display data source text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[13].innerHTML).contains('Data Source: Prov1');
    });
});
