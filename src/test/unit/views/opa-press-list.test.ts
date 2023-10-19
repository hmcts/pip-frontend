import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';

const PAGE_URL = '/opa-press-list?artefactId=abc';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/opaPressList.json'), 'utf-8');
const jsonData = JSON.parse(rawData);
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metadata = JSON.parse(rawMetadata)[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metadata);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({
    name: "Court name",
    welshName: "Welsh court name",
});

describe('OPA Press List page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display list header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains(
            'Online Plea and Allocation Cases Press View for Court name',
            'Header does not match'
        );
    });

    it('should display publication date', () => {
        const date = htmlRes.getElementsByClassName('govuk-body');
        expect(date[1].innerHTML).contains(
            'Last updated: 14 September 2023 at 12:30am',
            'Publication date does not match'
        );
    });

    it('should display version information', () => {
        const version = htmlRes.getElementsByClassName('govuk-body');
        expect(version[2].innerHTML).contains('Draft: Version 1.0', 'Version does not match');
    });

    it('should display venue address postcode', () => {
        const address = htmlRes.getElementsByClassName('venue-address');
        expect(address[0].innerHTML).contains('AA1 1AA', 'Venue address postcode does not match');
    });

    it('should display the important information content', () => {
        const info = htmlRes.getElementsByClassName('govuk-details__text');
        expect(info[0].innerHTML).contains(
            'additional documents from these cases are available to the members of the media on request',
            'Important information content does not match'
        );
    });

    it('should display publishing restriction heading', () => {
        const restriction = htmlRes.getElementsByClassName('restriction-list-section');
        expect(restriction[0].innerHTML).contains(
            'Restrictions on publishing or writing about these cases',
            'Publishing restriction heading does not match'
        );
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases', 'Search box does not match');
    });

    it('should display the plea date section heading', () => {
        const pleaDateHeading = htmlRes.getElementsByClassName('plea-date-1');
        expect(pleaDateHeading[0].innerHTML).contains('Open Pleas registered: 22/09/2023', 'Plea date section heading does not match');
    });

    it('should display the defendant name', () => {
        const defendantHeading = htmlRes.getElementById('accordion-default-heading-1');
        expect(defendantHeading.innerHTML).contains('Defendant Name: Surname2, Forename2 MiddleName2', 'Defendant name does not match');
    });

    it('should display defendant information correctly', () => {
        const div1 = htmlRes.getElementsByClassName('govuk-grid-column-two-thirds');
        const items1 = div1.item(0).children;
        expect(items1[0].innerHTML).contains('DOB and Age:', 'DOB and age does not match');
        expect(items1[0].innerHTML).contains('01/01/1985 Age: 38', 'DOB and age does not match');
        expect(items1[1].innerHTML).contains('Address:', 'Address does not match');
        expect(items1[1].innerHTML).contains('Address Line 1, Address Line 2, Town, County, BB1 1BB', 'Address does not match');
        expect(items1[2].innerHTML).contains('Prosecuting Authority:', 'Prosecuting authority does not match');
        expect(items1[2].innerHTML).contains('Prosecuting authority ref', 'Prosecuting authority does not match');
        expect(items1[3].innerHTML).contains('Scheduled First Hearing:', 'Scheduled first hearing does not match');
        expect(items1[3].innerHTML).contains('01/10/2023', 'DScheduled first hearing does not match');

        const div2 = htmlRes.getElementsByClassName('govuk-grid-column-one-third');
        const items2 = div2.item(0).children;
        expect(items2[0].innerHTML).contains('Case Ref / URN:', 'Case ref does not match');
        expect(items2[0].innerHTML).contains('URN8888', 'Case ref does not match');
        expect(items2[1].innerHTML).contains('Case Reporting Restriction', 'Case reporting restriction does not match');
        expect(items2[1].innerHTML).contains(
            'Yes - Case reporting Restriction detail line 1, Case reporting restriction detail line 2',
            'Case reporting restriction does not match'
        );
    });

    it('should display offence title and section', () => {
        const offence = htmlRes.getElementsByClassName('govuk-details__summary-text');
        expect(offence[1].innerHTML).contains('1. Offence title 2 - Offence section 2', 'Offence title and section does not match');
    });

    it('should display offence information', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[0].innerHTML).contains('Indicated Plea', 'Indicated plea does not match');
        expect(cell[1].innerHTML).contains('NOT_GUILTY', 'Indicated plea does not match');
        expect(cell[2].innerHTML).contains('Date of Indicated Plea', 'Indicated plea date does not match');
        expect(cell[3].innerHTML).contains('22/09/2023', 'Indicated plea date does not match');
        expect(cell[4].innerHTML).contains('Offence Reporting Restriction', 'Offence reporting restriction does not match');
        expect(cell[5].innerHTML).contains('Offence reporting restriction detail 1', 'Offence reporting restriction does not match');
    });

    it('should display offence wording', () => {
        const offence = htmlRes.getElementsByClassName('govuk-details__text');
        expect(offence[1].innerHTML).contains('Offence Wording 2', 'Offence wording does not match');
    });
});
