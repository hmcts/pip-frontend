import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';

const PAGE_URL = '/magistrates-standard-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const restrictionHeading = 'govuk-grid restriction-list-section';
const accordionClass = 'govuk-accordion__section-button';
const siteAddressClass = 'site-address';

const courtName = "Abergavenny Magistrates' Court";
const expectedHeader = 'Standard Court list for ' + courtName;
const restrictionHeadingText = 'Restrictions on publishing or writing about these cases';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/magsStandardList.json'), 'utf-8');
const magistrateStandardListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(magistrateStandardListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

describe('Magistrate Standard List page', () => {
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

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases');
    });

    it('should display the site name for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[0].innerHTML).contains('Courtroom 1', 'Could not find the site name in section 1');
    });

    it('should display the courtroom', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[1].innerHTML).contains('Courtroom 2', 'Could not find the Court name with Sitting at text');
    });

    it('should display accordion open/close all', () => {
        const accordion = htmlRes.getElementsByClassName(accordionClass);
        expect(accordion[0].innerHTML).to.contains(
            'Defendant Name:  Surname1, John Smith1 (male)',
            'Could not find the accordion heading'
        );
    });

    it('should display defendant information correctly', () => {
        const div1 = htmlRes.getElementsByClassName('govuk-grid-column-two-thirds no_padding');
        const items1 = div1.item(0).children;
        expect(items1[0].innerHTML).contains('2:30pm');
        expect(items1[0].innerHTML).contains('2 hours 30 mins');
        expect(items1[0].innerHTML).contains('[2 of 3]');
        expect(items1[2].innerHTML).contains('39');
        expect(items1[3].innerHTML).contains('Address Line 1, Address Line 2, Month A, County A, AA1 AA1');
        expect(items1[4].innerHTML).contains('Test1234');
        expect(items1[5].innerHTML).contains('12');
        expect(items1[6].innerHTML).contains('VIDEO HEARING');

        const div2 = htmlRes.getElementsByClassName('govuk-grid-column-one-third');
        const items2 = div2.item(0).children;
        expect(items2[0].innerHTML).contains('45684548');
        expect(items2[1].innerHTML).contains('Need to confirm');
        expect(items2[2].innerHTML).contains('mda');
        expect(items2[3].innerHTML).contains('ADULT');
    });

    it('should display correct offence title', () => {
        const cell = htmlRes.getElementsByClassName('govuk-details__summary-text');
        expect(cell[0].innerHTML).contains('1. drink driving');
    });

    it('should display correct offence information', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[1].innerHTML).contains('NOT_GUILTY');
        expect(cell[3].innerHTML).contains('Need to confirm');
        expect(cell[5].innerHTML).contains('14/09/2016');
        expect(cell[7].innerHTML).contains('14/09/2016');
    });
});
