import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';
import { describe } from '@jest/globals';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';

const urlDailyList = '/magistrates-public-adult-court-list-daily';
const artefactIdDailyList = 'abc';

const bodyClass = 'govuk-body';
const tableHeaderClass = 'govuk-table__header';
const tableCellClass = 'govuk-table__cell';

const rawData = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/magistratesPublicAdultCourtList.json'),
    'utf-8'
);
const listData = JSON.parse(rawData);
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');

const metadataDailyList = JSON.parse(rawMetadata)[0];
metadataDailyList.listType = 'MAGISTRATES_PUBLIC_ADULT_COURT_LIST_DAILY';

const rawCourtData = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawCourtData);

const magsAdultCourtListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const magsAdultCourtListMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

magsAdultCourtListJsonStub.withArgs(artefactIdDailyList).resolves(listData);
magsAdultCourtListMetadataStub.withArgs(artefactIdDailyList).resolves(metadataDailyList);

let htmlRes: Document;

describe('Magistrates Public Adult Court List Daily page', () => {
    const pageUrl = urlDailyList + '?artefactId=' + artefactIdDailyList;

    beforeAll(async () => {
        await request(app)
            .get(pageUrl)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).equals('Magistrates Public List', 'Page title does not match');
    });

    it('should display page heading', () => {
        const heading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(heading[0].innerHTML).contains(
            "Magistrates Public List for Abergavenny Magistrates' Court",
            'Could not find the header'
        );
    });

    it('should display list date', () => {
        const body = htmlRes.getElementsByClassName(bodyClass);
        expect(body[0].innerHTML).equals('List for 14 February 2022');
    });

    it('should display publication date', () => {
        const body = htmlRes.getElementsByClassName(bodyClass);
        expect(body[1].innerHTML).contains('Last updated 31 July 2025 at 9:05am', 'Publication date does not match');
    });

    it('should display reporting restriction heading', () => {
        const restriction = htmlRes.getElementsByClassName('govuk-grid restriction-list-section');
        expect(restriction[0].innerHTML).contains(
            'Restrictions on publishing or writing about these cases',
            'Reporting restriction heading does not match'
        );
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases', 'Search input box not found');
    });

    it('should display Court Name section heading', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-accordion__section-heading');
        expect(searchInput[0].innerHTML).contains(
            "North Shields Magistrates' Court",
            'Court Name section heading not found'
        );
    });

    it('should display Court Room', () => {
        const body = htmlRes.getElementsByClassName(bodyClass);
        expect(body[7].innerHTML).contains('Sitting at 1', 'Court Room does not match');
    });

    it('should display LJA', () => {
        const body = htmlRes.getElementsByClassName(bodyClass);
        expect(body[8].innerHTML).contains("LJA: North Northumbria Magistrates' Court", 'LJA does not match');
    });

    it('should display Session Start Time', () => {
        const body = htmlRes.getElementsByClassName(bodyClass);
        expect(body[9].innerHTML).contains('Session start 9am', 'Session Start Time does not match');
    });

    it('should display Listing time table header', () => {
        const cell = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(cell[0].innerHTML).contains('Listing Time', 'Listing time header does not match');
    });

    it('should display Defendant Name table header', () => {
        const cell = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(cell[1].innerHTML).contains('Defendant Name', 'Defendant name header does not match');
    });

    it('should display Case Number table header', () => {
        const cell = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(cell[2].innerHTML).contains('Case Number', 'Case number header does not match');
    });

    it('should display Block Start table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[0].innerHTML).contains('9am', 'Block Start time does not match');
    });

    it('should display Defendant Name table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[1].innerHTML).contains('Mr Test User', 'Defendant name does not match');
    });

    it('should display Case Number table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[2].innerHTML).contains('1000000000', 'Case number does not match');
    });
});
