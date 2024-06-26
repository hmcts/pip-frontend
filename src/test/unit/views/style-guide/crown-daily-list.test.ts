import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';

const PAGE_URL = '/crown-daily-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const restrictionHeading = 'govuk-grid restriction-list-section';
const accordionClass = 'govuk-accordion__section-button';
const siteAddressClass = 'site-address';

const courtName = "Abergavenny Magistrates' Court";
const expectedHeader = 'Crown Daily List for ' + courtName;
const restrictionHeadingText = 'Restrictions on publishing or writing about these cases';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownDailyList.json'), 'utf-8');
const crownDailyListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'CROWN_DAILY_LIST';

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(crownDailyListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

describe('Crown daily List page', () => {
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

    it('should display restriction heading', () => {
        const restriction = htmlRes.getElementsByClassName(restrictionHeading);
        expect(restriction[0].innerHTML).contains(
            restrictionHeadingText,
            'Could not find the display restriction heading'
        );
    });

    it('should display the site name for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[0].innerHTML).contains('Court A', 'Could not find the site name in section 1');
    });

    it('should display the site name for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[1].innerHTML).contains(
            'Sitting at Court B',
            'Could not find the Court name with Sitting at text'
        );
    });

    it('should display accordion open/close all', () => {
        const accordion = htmlRes.getElementsByClassName(accordionClass);
        expect(accordion[0].innerHTML).to.contains(
            '1: Judge KnownAs, Judge KnownAs 2',
            'Could not find the accordion heading'
        );
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases');
    });

    it('should display Sitting at time', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[0].innerHTML).contains('10:40am');
    });

    it('should display Case Reference', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[1].innerHTML).contains('12345678');
    });

    it('should display Defendant Name', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[2].innerHTML).contains('Surname 1, Forename 1');
    });

    it('should display Hearing Type', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[3].innerHTML).contains('FHDRA1 (First Hearing and Dispute Resolution Appointment)');
    });

    it('should display Case Sequence Indicator if it is there', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[4].innerHTML).contains('[2 of 3]');
    });

    it('should display Case name with Case Sequence Indicator if it is there', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[4].innerHTML).equal('1 hour 5 mins [2 of 3]');
    });

    it('should display Case Name without Case Sequence Indicator', () => {
        const rows = htmlRes.getElementsByClassName('govuk-table__row');
        const cell = rows.item(5).children;
        expect(cell[4].innerHTML.trim()).equals('1 hour 5 mins');
    });

    it('should display Prosecuting Authority', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[5].innerHTML).contains('Pro_Auth');
    });

    it('should display Reporting Restriction detail', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[6].innerHTML).contains(
            'This is a reporting restriction detail, This is another reporting restriction detail'
        );
        expect(cell[6].getAttribute('class')).contains('no-border-bottom');
    });

    it('should display Linked Cases', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[12].innerHTML).contains('caseid111, caseid222');
        expect(cell[6].getAttribute('class')).contains('no-border-bottom');
    });

    it('should display Listing Notes', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[18].innerHTML).contains('Listing details text');
    });

    it('should display the to be allocated for unallocated case section', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[4].innerHTML).contains(
            'The following cases may be taken in any court',
            'Could not find the unallocated case section'
        );
        expect(siteAddress[5].innerHTML).contains('To be allocated:', 'Could not find the to be allocated section');
    });

    it('reporting restriction detail should contain border when only element', () => {
        const rows = htmlRes.getElementsByClassName('govuk-table__row');
        const reportingRestrictionCell = rows.item(8).getElementsByClassName('govuk-table__cell');

        expect(reportingRestrictionCell[0].getAttribute('class')).not.contains('no-border-bottom');
    });

    it('linked cases should contain border when only element', () => {
        const rows = htmlRes.getElementsByClassName('govuk-table__row');
        const reportingRestrictionCell = rows.item(8).getElementsByClassName('govuk-table__cell');

        expect(reportingRestrictionCell[0].getAttribute('class')).not.contains('no-border-bottom');
    });

    it('linked cases should contain border when only element', () => {
        const rows = htmlRes.getElementsByClassName('govuk-table__row');
        const linkedCases = rows.item(10).getElementsByClassName('govuk-table__cell');

        expect(linkedCases[0].getAttribute('class')).not.contains('no-border-bottom');
    });

    it('main row should contain border when only element', () => {
        const rows = htmlRes.getElementsByClassName('govuk-table__row');
        const mainRow = rows.item(11).getElementsByClassName('govuk-table__cell');

        expect(mainRow[0].getAttribute('class')).not.contains('no-border-bottom');
    });
});
