import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';

const PAGE_URL = '/family-daily-cause-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const summaryText = 'govuk-details__text';
const accordionClass = 'govuk-accordion__section-button';
const siteAddressClass = 'site-address';

const courtName = "Abergavenny Magistrates' Court";
const expectedHeader = 'Family Daily Cause List for ' + courtName;
const summaryHeadingText = 'Important information';
const accordionHeading = '1, Before: Presiding';
const applicantRespondent = 'Surname, Legal Advisor: Mr Individual Forenames Individual Middlename Individual Surname';
let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/familyDailyCauseList.json'), 'utf-8');
const familyDailyCauseListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'FAMILY_DAILY_CAUSE_LIST';

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(familyDailyCauseListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

describe('Family Daily Cause List page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
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
        expect(summary[0].innerHTML).contains('court1@moj.gov.u', 'Could not find the court name in summary text');
    });

    it('should display court contact number summary paragraph', () => {
        const summary = htmlRes.getElementsByClassName(summaryText);
        expect(summary[0].innerHTML).contains('01772 844700', 'Could not find the court name in summary text');
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases');
    });

    it('should display the site name for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[0].innerHTML).contains('Court A', 'Could not find the site name in section 1');
        expect(siteAddress[6].innerHTML).contains('Court B', 'Could not find the site name in section 2');
    });

    it('should display the site address line 1 for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[1].innerHTML).contains('Address Line 1', 'Could not find the address line 1 in section 1');
        expect(siteAddress[7].innerHTML).contains('Address Line 1', 'Could not find the address line 1 in section 2');
    });

    it('should display the site address line 2 for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[2].innerHTML).contains('Address Line 2', 'Could not find the address line 2 in section 1');
        expect(siteAddress[8].innerHTML).contains('Address Line 2', 'Could not find the address line 2 in section 2');
    });

    it('should display the site town for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[3].innerHTML).contains('Town A', 'Could not find the town in section 1');
        expect(siteAddress[9].innerHTML).contains('Town B', 'Could not find the town in section 2');
    });

    it('should display the site county for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[4].innerHTML).contains('County A', 'Could not find the county in section 1');
        expect(siteAddress[10].innerHTML).contains('County B', 'Could not find the county in section 2');
    });

    it('should display the site postcode for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[5].innerHTML).contains('AA1 AA1', 'Could not find the postcode in section 1');
        expect(siteAddress[11].innerHTML).contains('BB1 BB1', 'Could not find the postcode in section 2');
    });

    it('should display accordion heading', () => {
        const accordion = htmlRes.getElementsByClassName(accordionClass);
        expect(accordion[0].innerHTML).contains(accordionHeading, 'Could not find the accordion heading');
    });

    it('should display case time', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[0].innerHTML).contains('10:40');
    });

    it('should display Case Id', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[1].innerHTML).contains('12345678');
    });

    it('should display Case name', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[2].innerHTML).contains('A1 Vs B1');
    });

    it('should display Case Sequence Indicator if it is there', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[2].innerHTML).contains('[2 of 3]');
    });

    it('should display Case name with Case Sequence Indicator if it is there', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[2].innerHTML).equal('A1 Vs B1 [2 of 3]');
    });

    it('should display Case Name without Case Sequence Indicator', () => {
        const rows = htmlRes.getElementsByClassName('govuk-table__row');
        const cell = rows.item(2).children;
        expect(cell[2].innerHTML).equals('A2 Vs B2');
    });

    it('should display Case type', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[3].innerHTML).contains('type');
    });

    it('should display Hearing Type', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[4].innerHTML).contains('FMPO');
    });

    it('should display Hearing platform', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[5].innerHTML).contains('testSittingChannel');
    });

    it('should display Hearing duration', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[6].innerHTML).contains('1 hour 5 mins');
    });

    it('should display Applicant/petitioner', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[7].innerHTML).contains(applicantRespondent);
    });

    it('should display respondent', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[8].innerHTML).contains(applicantRespondent);
    });

    it('should display applicant petitioner using organisation', () => {
        const rows = htmlRes.getElementsByClassName('govuk-table__row');
        const cell = rows.item(4).children;
        expect(cell[7].innerHTML).contains('Applicant org name, Legal Advisor: Applicant rep org name');
    });

    it('should display respondent using organisation', () => {
        const rows = htmlRes.getElementsByClassName('govuk-table__row');
        const cell = rows.item(4).children;
        expect(cell[8].innerHTML).contains('Respondent org name, Legal Advisor: Respondent rep org name');
    });
});
