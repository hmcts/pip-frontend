import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';

const PAGE_URL = '/et-daily-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const summaryText = 'govuk-details__text';
const accordionClass = 'govuk-accordion__section-button';
const siteAddressClass = 'site-address';
const courtName = 'Regional Venue South';
const expectedHeader1 = 'Employment Tribunals Daily List: Bedford';
const summaryHeadingText = 'Important information';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/etDailyList.json'), 'utf-8');
const dailyCauseListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(dailyCauseListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

describe('ET Daily List page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(expectedHeader1, 'Could not find the header');
    });

    it('should display summary', () => {
        const summary = htmlRes.getElementsByClassName(summaryHeading);
        expect(summary[0].innerHTML).contains(summaryHeadingText, 'Could not find the display summary heading');
    });

    it('should display court name summary paragraph', () => {
        const summary = htmlRes.getElementsByClassName(summaryText);
        expect(summary[0].innerHTML).contains(courtName, 'Could not find the court name in summary text');
    });

    it('should display court email summary paragraph', () => {
        const summary = htmlRes.getElementsByClassName(summaryText);
        expect(summary[0].innerHTML).contains('a@b.com', 'Could not find the court name in summary text');
    });

    it('should display court contact number summary paragraph', () => {
        const summary = htmlRes.getElementsByClassName(summaryText);
        expect(summary[0].innerHTML).contains(
            '+44 1234 1234 1234',
            'Could not find the court telephone no in summary text'
        );
    });

    it('should display the site name for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[0].innerHTML).contains('Leicester Crown Court', 'Could not find the site name in section 1');
        expect(siteAddress[4].innerHTML).contains(
            'Nottingham Justice Centre',
            'Could not find the site name in section 2'
        );
    });

    it('should display the site address line 1 for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[1].innerHTML).contains('5-7 Hill Street', 'Could not find the address line 1 in section 1');
        expect(siteAddress[5].innerHTML).contains('1 Crown Road', 'Could not find the address line 1 in section 2');
    });

    it('should display the site town for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[2].innerHTML).contains('Leicester', 'Could not find the town in section 1');
        expect(siteAddress[6].innerHTML).contains('Nottingham', 'Could not find the town in section 2');
    });

    it('should display the site postcode for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[3].innerHTML).contains('L5 4UU', 'Could not find the postcode in section 1');
        expect(siteAddress[7].innerHTML).contains('NG1 2FP', 'Could not find the postcode in section 2');
    });

    it('should display accordion open/close all', () => {
        const accordion = htmlRes.getElementsByClassName(accordionClass);
        expect(accordion[0].innerHTML).to.contains('Court 1', 'Could not find the accordion heading');
    });

    it('should not have undefined when title display accordion open/close all', () => {
        const accordion = htmlRes.getElementsByClassName(accordionClass);
        expect(accordion[0].innerHTML).to.contains('Court 1', 'Could not find the accordion heading');
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases');
    });

    it('should display Hearing time', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[0].innerHTML).contains('9:30am');
    });

    it('should display Case ID', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[2].innerHTML).contains('12341234');
    });

    it('should display Claimant Name', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[3].innerHTML).contains('HRH');
    });

    it('should display Case Sequence Indicator if it is there', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[1].innerHTML).contains('[2 of 3]');
    });

    it('should display Duration with Case Sequence Indicator if it is there', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[1].innerHTML).equal('2 hours [2 of 3]');
    });

    it('should display Case Name without Case Sequence Indicator', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        const x = 9;
        console.log(cell[x]);
        expect(cell[x].innerHTML).equals('3 mins ');
    });

    it('should display Hearing Type', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[13].innerHTML).contains('Hearing Type 1');
    });

    it('should display Hearing platform (Location)', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[7].innerHTML).contains('This is a sitting channel');
    });

    it('should display Respondent', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[4].innerHTML).contains('Capt. S. Jenkins');
    });
});
