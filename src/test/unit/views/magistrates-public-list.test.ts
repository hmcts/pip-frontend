import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';

const PAGE_URL = '/magistrates-public-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const bodyClass = 'govuk-body';
const restrictionHeading = 'govuk-grid restriction-list-section';
const accordionClass = 'govuk-accordion__section-button';
const siteAddressClass = 'site-address';

const courtName = "Abergavenny Magistrates' Court";
const expectedHeader = `Magistrates Public List for ${courtName}`;
const restrictionHeadingText = 'Restrictions on publishing or writing about these cases';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/magistratesPublicList.json'), 'utf-8');
const magistratesPublicListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(magistratesPublicListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

describe('Magistrates public List page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).equals(expectedHeader, 'Could not find the header');
    });

    it('should display last updated date and time', () => {
        const body = htmlRes.getElementsByClassName(bodyClass);
        expect(body[5].innerHTML).equals(
            'Last updated 14 September 2020 at 12:30am',
            'Last updated date and time does not match'
        );
    });

    it('should display venue address', () => {
        const body = htmlRes.getElementsByClassName(bodyClass);
        expect(body[7].innerHTML).equals('THE LAW COURTS<br>\nMain Road<br>\nPR1 2LL', 'Venue address does not match');
    });

    it('should display venue telephone and email', () => {
        const body = htmlRes.getElementsByClassName(bodyClass);
        expect(body[8].innerHTML).equals('Telephone: 01772 844700', 'Venue telephone does not match');
        expect(body[9].innerHTML).equals('Email: court1@moj.gov.uk', 'Venue email does not match');
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
        expect(accordion[0].innerHTML).to.contains('1: Firstname1 Surname1', 'Could not find the accordion heading');
    });

    it('should not have undefined when title display accordion open/close all', () => {
        const accordion = htmlRes.getElementsByClassName(accordionClass);
        expect(accordion[0].innerHTML).to.contains('Firstname2 Surname2', 'Could not find the accordion heading');
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases');
    });

    it('should display Sitting at time', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[0].innerHTML).contains('10:40am');
    });

    it('should display Sitting at time with zero minute', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[30].innerHTML).contains('8am');
    });

    it('should display Case Reference', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[1].innerHTML).contains('12345678');
    });

    it('should display Defendant Name', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[2].innerHTML).contains('Defendant_SN, Defendant_FN');
    });

    it('should display Hearing Type', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[3].innerHTML).contains('FHDRA1 (First Hearing and Dispute Resolution Appointment)');
    });

    it('should display Prosecuting Authority', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[4].innerHTML).contains('Pro_Auth');
    });

    it('should display Case Sequence Indicator if it is there', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[5].innerHTML).contains('[2 of 3]');
    });

    it('should display Case name with Case Sequence Indicator if it is there', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[5].innerHTML).equal('1 hour 5 mins [2 of 3]');
    });

    it('should display Case Name without Case Sequence Indicator', () => {
        const rows = htmlRes.getElementsByClassName('govuk-table__row');
        const cell = rows.item(5).children;
        expect(cell[5].innerHTML.trim()).equals('1 hour 5 mins');
    });
});
