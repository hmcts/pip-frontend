import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';
import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';

const PAGE_URL = '/cop-daily-cause-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const summaryText = 'govuk-details__text';
const bodyText = 'govuk-body';
const accordionHeading = 'govuk-accordion__section-heading';
const courtNameClass = 'site-address';

const expectedHeader = 'In the Court of Protection';
const summaryHeadingText = 'Important information';
let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/copDailyCauseList.json'), 'utf-8');
const copDailyCauseList = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'COP_DAILY_CAUSE_LIST';

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(copDailyCauseList);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

describe('Cop daily cause list page', () => {
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

    it('should display fact link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[5].innerHTML).contains('Find contact details and other information about courts and tribunals');
    });

    it('should display fact link', () => {
        const text = htmlRes.getElementsByClassName('govuk-link');
        expect(text[5].getAttribute('href')).eq('https://www.find-court-tribunal.service.gov.uk/');
    });

    it('should display summary', () => {
        const summary = htmlRes.getElementsByClassName(summaryHeading);
        expect(summary[0].innerHTML).contains(summaryHeadingText, 'Could not find the display summary heading');
    });

    it('should display court email summary paragraph', () => {
        const summary = htmlRes.getElementsByClassName(summaryText);
        expect(summary[0].innerHTML).contains('a@b.com', 'Could not find the court name in summary text');
    });

    it('should display court contact number summary paragraph', () => {
        const summary = htmlRes.getElementsByClassName(summaryText);
        expect(summary[0].innerHTML).contains('+44 1234 1234 1234', 'Could not find the court name in summary text');
    });

    it('should display list for text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[4].innerHTML).contains('List for');
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases');
    });

    it('should display last updated text', () => {
        const text = htmlRes.getElementsByClassName(bodyText)[6];
        expect(text.innerHTML).contains('Last updated');
    });

    it('should display the court name on the page', () => {
        const courtNameText = htmlRes.getElementsByClassName(courtNameClass)[0];
        expect(courtNameText.innerHTML).contains('Regional Venue North');
    });

    it('should display court room name and presiding judge before other judges', () => {
        const courtRoomNameHeading = htmlRes.getElementsByClassName(accordionHeading)[0];
        expect(courtRoomNameHeading.innerHTML).contains(
            'Room 1, Before Judge KnownAs Presiding, Judge KnownAs 2, Judge KnownAs 3'
        );
    });

    it('should display court room name and all judges if no presiding judge', () => {
        const courtRoomNameHeading = htmlRes.getElementsByClassName(accordionHeading)[1];
        expect(courtRoomNameHeading.innerHTML).contains(
            'Room 2, Before Judge KnownAs 1, Judge KnownAs 2, Judge KnownAs 3'
        );
    });

    it('should display court room name only if no judiciary ', () => {
        const courtRoomNameHeading = htmlRes.getElementsByClassName(accordionHeading)[2];
        expect(courtRoomNameHeading.innerHTML).contains('Room 3');
        expect(courtRoomNameHeading.innerHTML).not.contains('Before');
    });

    it('should display data source text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[7].innerHTML).contains('Data Source');
    });

    it('should display reporting restrictions', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[7].innerHTML).contains('Reporting restriction 1, Reporting restriction 2');
    });

    it('should display case type correctly', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[3].innerHTML).contains('Case Type');
    });

    it('should not display reporting restrictions row when reportingRestrictions is absent', () => {
        const accordionSections = htmlRes.getElementsByClassName('govuk-accordion__section-content');
        const room2Table = accordionSections[1].getElementsByTagName('table')[0];
        const tableCells = Array.from(room2Table.getElementsByClassName('govuk-table__cell'));
        const foundRestriction = tableCells.some(cell => cell.innerHTML.includes('Reporting restriction'));
        expect(foundRestriction).to.be.false;
    });

    it('should set correct colspan for reporting restrictions row', () => {
        const restrictionCell = htmlRes.querySelector('td[colspan="7"] .linked-cases-heading');
        expect(restrictionCell).to.not.be.null;
        expect(restrictionCell?.parentElement?.getAttribute('colspan')).to.equal('7');
    });
});
