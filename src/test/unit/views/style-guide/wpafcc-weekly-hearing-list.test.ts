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

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/wpafccWeeklyHearingList.json'), 'utf-8');
const jsonData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'WPAFCC_WEEKLY_HEARING_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

let htmlRes: Document;
const PAGE_URL = '/wpafcc-weekly-hearing-list?artefactId=abc';

describe('WPAFCC Weekly Hearing List page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(
            'First-tier Tribunal (War Pensions and Armed Forces Compensation) Weekly Hearing List'
        );
    });

    it('should display list date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[4].innerHTML).contains('List for week commencing 14 February 2022');
    });

    it('should display join hearing message', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[5].innerHTML).contains(
            'Members of the public wishing to observe a hearing or representatives of the media may, on their request, join any telephone or video hearing remotely'
        );
    });

    it('should display observe hearing link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[6].innerHTML).contains(
            'Observe a court or tribunal hearing as a journalist, researcher or member of the public'
        );
    });

    it('should display observe hearing link', () => {
        const text = htmlRes.getElementsByClassName(govukLinkClass);
        expect(text[5].getAttribute('href')).eq('https://www.gov.uk/guidance/observe-a-court-or-tribunal-hearing');
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

    it('should display Judges(s) header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[4].innerHTML).equals('Judge(s)');
    });

    it('should display Member(s) header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[5].innerHTML).equals('Member(s)');
    });

    it('should display Mode of Hearing header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[6].innerHTML).equals('Mode of hearing');
    });

    it('should display Venue header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[7].innerHTML).equals('Venue');
    });

    it('should display Additional Information header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[8].innerHTML).equals('Additional information');
    });

    it('should display Date cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[0].innerHTML).equals('16 December 2024');
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

    it('should display Judge(s) cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[4].innerHTML).equals('Judge A');
    });

    it('should display Member(s) cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[5].innerHTML).equals('Member A');
    });

    it('should display Mode of Hearing cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[6].innerHTML).equals('Case Management Hearing');
    });

    it('should display Venue cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[7].innerHTML).contains('This is a venue name');
    });

    it('should display Additional information cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[8].innerHTML).contains('This is additional information');
    });

    it('should display data source text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[7].innerHTML).contains('Data Source: prov1');
    });
});
