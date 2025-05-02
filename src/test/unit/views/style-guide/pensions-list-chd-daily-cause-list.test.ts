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
    path.resolve(__dirname, '../../mocks/pensionsListChdDailyCauseList.json'),
    'utf-8'
);
const jsonData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'PENSIONS_LIST_CHD_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

let htmlRes: Document;
const PAGE_URL = '/pensions-list-chd-daily-cause-list?artefactId=abc';

describe('Pensions List (ChD) Daily Cause List page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains('Pensions List (Chancery Division) Daily Cause List');
    });

    it('should display venue', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[4].innerHTML).equals('Rolls Building');
        expect(text[5].innerHTML).equals('Fetter Lane, London');
        expect(text[6].innerHTML).equals('EC4A 1NL');
    });

    it('should display list date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[7].innerHTML).equals('List for 14 February 2022');
    });

    it('should display list updated date text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[8].innerHTML).equals('Last updated 20 January 2025 at 9:30am');
    });

    it('should display important information heading', () => {
        const text = htmlRes.getElementsByClassName('govuk-details__summary-text');
        expect(text[0].innerHTML).equals('Important information');
    });

    it('should display important information message', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].innerHTML).contains(
            'If a representative of the media or member of the public wishes to attend the hearing they should contact the listing office chanceryjudgeslisting@justice.gov.uk who will put them in touch with the relevant person.'
        );
    });

    it('should display Judge header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[0].innerHTML).equals('Judge');
    });

    it('should display Time header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[1].innerHTML).equals('Time');
    });

    it('should display Venue header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[2].innerHTML).equals('Venue');
    });

    it('should display Type header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[3].innerHTML).equals('Type');
    });

    it('should display Case Number header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[4].innerHTML).equals('Case number');
    });

    it('should display Case Name header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[5].innerHTML).equals('Case name');
    });

    it('should display Additional Information header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[6].innerHTML).equals('Additional information');
    });

    it('should display Judge cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[0].innerHTML).equals('Judge A');
    });

    it('should display Time cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[1].innerHTML).equals('9am');
    });

    it('should display Venue cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[2].innerHTML).equals('Venue A');
    });

    it('should display Type cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[3].innerHTML).equals('Type A');
    });

    it('should display Case Number cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[4].innerHTML).equals('12345');
    });

    it('should display Case Name cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[5].innerHTML).equals('Case name A');
    });

    it('should display Additional Information cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[6].innerHTML).equals('This is additional information');
    });

    it('should display data source text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[15].innerHTML).contains('Data Source: Prov1');
    });
});
