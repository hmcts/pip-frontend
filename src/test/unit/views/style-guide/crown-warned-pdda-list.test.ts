import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';

const PAGE_URL = '/crown-warned-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const bodyText = 'govuk-body';
const listInfoClass = 'list-info';
const restrictionHeadingClass = 'restriction-list-section';
const warningTextClass = 'govuk-warning-text';
const accordionClass = 'govuk-accordion__section-button';
const tableHeaderClass = 'govuk-table__header';
const tableCellClass = 'govuk-table__cell';
const dataSourceClass = 'data-source';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownWarnedPddaList.json'), 'utf-8');
const crownWarnedPddaListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'CROWN_WARNED_PDDA_LIST';

const rawCourtData = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawCourtData);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(crownWarnedPddaListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

describe('Crown Warned PDDA List page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header with venue name and list type', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).equal(
            "Crown Warned List for Abergavenny Magistrates' Court",
            'Could not find the header'
        );
    });

    it('should display fact link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[4].innerHTML).contains('Find contact details and other information about courts and tribunals');
    });

    it('should display fact link', () => {
        const text = htmlRes.getElementsByClassName('govuk-link');
        expect(text[5].getAttribute('href')).eq('https://www.find-court-tribunal.service.gov.uk/');
    });

    it('should display list date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[5].innerHTML.trim()).equals('01 January 2024 to 02 January 2024');
    });

    it('should display publication date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[6].innerHTML).contains('Last updated 01 January 2024', 'Publication date does not match');
    });

    it('should display version', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[7].innerHTML).contains('Version TestVersion', 'Version does not match');
    });

    it('should display venue address', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[8].innerHTML).contains('TestAddressLine1', 'Address line 1 does not match');
        expect(text[8].innerHTML).contains('TestAddressLine2', 'Address line 2 does not match');
        expect(text[8].innerHTML).contains('TestPostcode', 'Address line 3 does not match');
    });

    it('should display the list information text first paragraph', () => {
        const info = htmlRes.getElementsByClassName(listInfoClass);
        expect(info[0].getElementsByTagName('p')[0].innerHTML).equal(
            'The undermentioned cases are warned for the hearing period of week commencing 14 February 2022',
            'Could not find the list information text first paragraph'
        );
    });

    it('should display the list information text second paragraph', () => {
        const info = htmlRes.getElementsByClassName(listInfoClass);
        expect(info[0].getElementsByTagName('p')[1].innerHTML).equal(
            'Any representation about the listing of a case should be made to the Listing Officer immediately',
            'Could not find the list information text second paragraph'
        );
    });

    it('should display the list information text third paragraph', () => {
        const info = htmlRes.getElementsByClassName(listInfoClass);
        expect(info[0].getElementsByTagName('p')[2].innerHTML).equal(
            'The prosecuting authority is the Crown Prosecution Service unless otherwise stated',
            'Could not find the list information text third paragraph'
        );
    });

    it('should display the list information text fourth paragraph', () => {
        const info = htmlRes.getElementsByClassName(listInfoClass);
        expect(info[0].getElementsByTagName('p')[3].innerHTML).equal(
            '*denotes a defendant in custody',
            'Could not find the list information text fourth paragraph'
        );
    });

    it('should display publishing restriction heading', () => {
        const restriction = htmlRes.getElementsByClassName(restrictionHeadingClass);
        expect(restriction[0].innerHTML).contains(
            'Restrictions on publishing or writing about these cases',
            'Could not find the display restriction heading'
        );
    });

    it('should display restriction first paragraph', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].getElementsByTagName('p')[0].innerHTML).contains(
            'You must check if any reporting restrictions apply before publishing details on any of the cases listed here either in writing, in a broadcast or by internet, including social media.',
            'restriction first paragraph does not match'
        );
    });

    it('should display publishing restriction warning text', () => {
        const waringText = htmlRes.getElementsByClassName(warningTextClass);
        expect(waringText[0].innerHTML).contains(
            "You'll be in contempt of court if you publish any information which is protected by a reporting restriction. You could get a fine, prison sentence or both.",
            'Could not find the publishing restriction warning text'
        );
    });

    it('should display restriction second paragraph', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].getElementsByTagName('p')[1].innerHTML).contains(
            'Specific restrictions ordered by the court will be mentioned on the cases listed here',
            'restriction second paragraph does not match'
        );
    });

    it('should display restriction third paragraph', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].getElementsByTagName('p')[2].innerHTML).contains(
            'However, restrictions are not always listed. Some apply automatically. For example, anonymity given to the victims of certain sexual offences.',
            'restriction third paragraph does not match'
        );
    });

    it('should display restriction fourth paragraph', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].getElementsByTagName('p')[3].innerHTML).contains(
            'To find out which reporting restrictions apply on a specific case, contact:',
            'restriction fourth paragraph does not match'
        );
    });

    it('should display restriction contact bullet point one', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].getElementsByTagName('li')[0].innerHTML).contains(
            'the court directly',
            'restriction contact bullet point one does not match'
        );
    });

    it('should display restriction contact bullet point two', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].getElementsByTagName('li')[1].innerHTML).contains(
            'HM Courts and Tribunals Service on 0330 808 4407',
            'restriction contact bullet point two does not match'
        );
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases');
    });

    it('should display all hearing types in accordion', () => {
        const accordion = htmlRes.getElementsByClassName(accordionClass);
        expect(accordion[0].innerHTML).to.equal('For Trial', 'Could not find first accordion heading');
        expect(accordion[1].innerHTML).to.equal('For Appeal', 'Could not find second accordion heading');
        expect(accordion[2].innerHTML).to.equal('For Sentence', 'Could not find third accordion heading');
        expect(accordion[3].innerHTML).to.equal('To be allocated', 'Could not find fourth accordion heading');
    });

    it('should display table header', () => {
        const header = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(header[0].innerHTML).to.equal('Fixed For', 'Could not find first table header value');
        expect(header[1].innerHTML).to.equal('Case Reference', 'Could not find second table header value');
        expect(header[2].innerHTML).to.equal('Defendant Name(s)', 'Could not find third table header value');
        expect(header[3].innerHTML).to.equal('Prosecuting Authority', 'Could not find fourth table header value');
        expect(header[4].innerHTML).to.equal('Linked Cases', 'Could not find fifth table header value');
        expect(header[5].innerHTML).to.equal('Listing Notes', 'Could not find sixth table header value');
    });

    it('should display fixed date', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[0].innerHTML).to.equal('01/01/2024', 'Could not find fixed date table cell');
    });

    it('should display case reference', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[1].innerHTML).to.equal('T20237000', 'Could not find case reference table cell');
    });

    it('should display requested defendant name', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[8].innerHTML).to.equal('TestDefendantRequestedName', 'Could not find defendant name table cell');
    });

    it('should display formatted defendant name', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[2].innerHTML).to.equal('Mr Pete Paul Dan Y', 'Could not find defendant name table cell');
    });

    it('should display prosecuting authority', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[3].innerHTML).to.equal(
            'Crown Prosecution Service',
            'Could not find prosecuting authority table cell'
        );
    });

    it('should display linked cases', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[4].innerHTML).to.equal('TestLinkedCaseNumber', 'Could not find linked cases table cell');
    });

    it('should display listing notes', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[5].innerHTML).to.contain('TestListNote', 'Could not find listing notes table cell');
    });

    it('should display data source', () => {
        const value = htmlRes.getElementsByClassName(dataSourceClass);
        expect(value[0].innerHTML).to.equal('Data Source: Prov1', 'Could not find data source');
    });
});
