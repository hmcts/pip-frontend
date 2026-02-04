import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';
import { describe } from '@jest/globals';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';

const urlDailyPddaList = '/crown-daily-list';
const artefactIdDailyPddaList = 'abc';

const bodyText = 'govuk-body';
const tableHeaderClass = 'govuk-table__header';
const tableCellClass = 'govuk-table__cell';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownDailyPddaList.json'), 'utf-8');
const listData = JSON.parse(rawData);
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');

const metadataDailyPddaList = JSON.parse(rawMetadata)[0];
metadataDailyPddaList.listType = 'CROWN_DAILY_PDDA_LIST';

const rawCourtData = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawCourtData);

const jsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

jsonStub.withArgs(artefactIdDailyPddaList).resolves(listData);
metadataStub.withArgs(artefactIdDailyPddaList).resolves(metadataDailyPddaList);

let htmlRes: Document;

describe('Crown Daily PDDA List page', () => {
    const pageUrl = urlDailyPddaList + '?artefactId=' + artefactIdDailyPddaList;

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
        expect(pageTitle).equals('Crown Daily List', 'Page title does not match');
    });

    it('should display page heading', () => {
        const heading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(heading[0].innerHTML).contains(
            "Crown Daily List for Abergavenny Magistrates' Court",
            'Page heading does not match'
        );
    });

    it('should display fact link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[0].innerHTML).contains('Find contact details and other information about courts and tribunals');
    });

    it('should display fact link', () => {
        const text = htmlRes.getElementsByClassName('govuk-link');
        expect(text[2].getAttribute('href')).eq('https://www.find-court-tribunal.service.gov.uk/');
    });

    it('should display list date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[1].innerHTML).equals('List for 10 September 2025');
    });

    it('should display publication date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[2].innerHTML).contains('Last updated 09 September 2025 at 11am', 'Publication date does not match');
    });

    it('should display version', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[3].innerHTML).contains('Version 1.0', 'Version does not match');
    });

    it('should display venue address', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[4].innerHTML).contains('1 Main Road', 'Address line 1 does not match');
        expect(text[4].innerHTML).contains('London', 'Address line 2 does not match');
        expect(text[4].innerHTML).contains('A1 1AA', 'Address line 3 does not match');
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

    it('should display court house name', () => {
        const heading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(heading[1].innerHTML).contains('TestCourtHouseName', 'Court house name does not match');
    });

    it('should display court house address', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].innerHTML).contains('1 Main Road', 'Court house address line 1 does not match');
        expect(text[11].innerHTML).contains('London', 'Court house address line 2 does not match');
        expect(text[12].innerHTML).contains('A1 1AA', 'Court house address line 3 does not match');
    });

    it('should display court house telephone', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[13].innerHTML).contains('02071234568', 'Court house telephone does not match');
    });

    it('should display court room and judge names section heading', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-accordion__section-heading');
        expect(searchInput[0].innerHTML).contains(
            'COURT 1: TestJudgeRequested, Ms TestJusticeForename TestJusticeSurname Sr',
            'Court room and judge names section heading not found'
        );
    });

    it('should display sitting at time', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[14].innerHTML).contains('Sitting at 10am', 'Sitting at time does not match');
    });

    it('should display Case Number table header', () => {
        const cell = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(cell[0].innerHTML).contains('Case Reference', 'Case number header does not match');
    });

    it('should display Defendant Name(s) table header', () => {
        const cell = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(cell[1].innerHTML).contains('Defendant Name(s)', 'Defendant name header does not match');
    });

    it('should display Hearing Type table header', () => {
        const cell = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(cell[2].innerHTML).contains('Hearing Type', 'Hearing type header does not match');
    });

    it('should display Prosecuting Authority table header', () => {
        const cell = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(cell[3].innerHTML).contains('Prosecuting Authority', 'Prosecuting authority header does not match');
    });

    it('should display Listing Notes table header', () => {
        const cell = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(cell[4].innerHTML).contains('Listing Notes', 'Listing notes header does not match');
    });

    it('should display Case Number table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[0].innerHTML).contains('T00112233', 'Case number cell does not match');
    });

    it('should display requested Defendant Name(s) table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[1].innerHTML).contains(
            'TestDefendantRequestedName, Mr TestDefendantForename TestDefendantSurname TestDefendantSuffix',
            'Defendant name cell does not match'
        );
    });

    it('should display formatted Defendant Name(s) table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[6].innerHTML).contains(
            'Mr TestDefendantForename1 TestDefendantForename2 TestDefendantSurname TestDefendantSuffix',
            'Defendant name cell does not match'
        );
    });

    it('should display Hearing Type table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[2].innerHTML).contains('TestHearingDescription', 'Hearing type cell does not match');
    });

    it('should display Prosecuting Authority table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[3].innerHTML).contains('Crown Prosecution Service', 'Prosecuting authority cell does not match');
    });

    it('should display Listing Notes table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[4].innerHTML).contains('TestListNote', 'Listing notes cell does not match');
    });
});
