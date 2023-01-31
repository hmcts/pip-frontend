import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';

const PAGE_URL = '/crown-warned-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const publicationDateClass = 'publication-date';
const versionClass = 'version';
const venueAddressClass = 'venue-address';
const listInfoClass = 'list-info';
const restrictionHeadingClass = 'restriction-list-section';
const accordionClass = 'govuk-accordion__section-button';
const tableHeaderClass = 'govuk-table__header';
const tableCellClass = 'govuk-table__cell';
const dataSourceClass = 'data-source';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/crownWarnedList.json'), 'utf-8');
const crownWarnedListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(crownWarnedListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

describe('Crown Warned List page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header with venue name and list type', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).equal('Manchester Court: Warned List', 'Could not find the header');
    });

    it('should display publication date', () => {
        const date = htmlRes.getElementsByClassName(publicationDateClass);
        expect(date[0].innerHTML).contains(
            'Last Updated 13 September 2022 at 12:30pm',
            'Could not find the publication date'
        );
    });

    it('should display version information', () => {
        const version = htmlRes.getElementsByClassName(versionClass);
        expect(version[0].innerHTML).contains('Draft: Version 1.0', 'Could not find the version information');
    });

    it('should display venue address postcode', () => {
        const address = htmlRes.getElementsByClassName(venueAddressClass);
        expect(address[0].innerHTML).contains('M1 1AA', 'Could not find the venue address');
    });

    it('should display the list information text', () => {
        const info = htmlRes.getElementsByClassName(listInfoClass);
        expect(info[0].innerHTML).contains(
            '*denotes a defendant in custody',
            'Could not find the list information text'
        );
    });

    it('should display publishing restriction heading', () => {
        const restriction = htmlRes.getElementsByClassName(restrictionHeadingClass);
        expect(restriction[0].innerHTML).contains(
            'Restrictions on publishing or writing about these cases',
            'Could not find the display restriction heading'
        );
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases');
    });

    it('should display all hearing types in accordion', () => {
        const accordion = htmlRes.getElementsByClassName(accordionClass);
        expect(accordion[0].innerHTML).to.equal('For Trial', 'Could not find first accordion heading');
        expect(accordion[1].innerHTML).to.equal('For Pre-Trial review', 'Could not find second accordion heading');
        expect(accordion[2].innerHTML).to.equal('For Appeal', 'Could not find third accordion heading');
        expect(accordion[3].innerHTML).to.equal(
            'For Appeal against Conviction',
            'Could not find fourth accordion heading'
        );
        expect(accordion[4].innerHTML).to.equal('For Sentence', 'Could not find fifth accordion heading');
    });

    it('should display table header', () => {
        const header = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(header[0].innerHTML).to.equal('Case Reference', 'Could not find first table header value');
        expect(header[1].innerHTML).to.equal('Defendant Name(s)', 'Could not find second table header value');
        expect(header[2].innerHTML).to.equal('Fixed For', 'Could not find third table header value');
        expect(header[3].innerHTML).to.equal('Represented By', 'Could not find fourth table header value');
        expect(header[4].innerHTML).to.equal('Prosecuting Authority', 'Could not find fifth table header value');
    });

    it('should display case reference', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[0].innerHTML).to.equal('12345678', 'Could not find case reference table cell');
    });

    it('should display defendant name(s)', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[1].innerHTML).to.equal('Kelly, Smith', 'Could not find defendant name(s) table cell');
    });

    it('should display hearing date', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[2].innerHTML).to.equal('27/07/2022', 'Could not find hearing date table cell');
    });

    it('should display defendant representative', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[3].innerHTML).to.equal('Defendant rep 1', 'Could not find defendant representative table cell');
    });

    it('should display prosecuting authority', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[4].innerHTML).to.equal('Prosecutor', 'Could not find prosecuting authority table cell');
    });

    it('should display linked cases', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[5].innerHTML).to.contain('123456, 123457', 'Could not find linked cases table cell');
    });

    it('should display listing notes', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[10].innerHTML).to.contain('Note 1', 'Could not find listing notes table cell');
    });

    it('should display data source', () => {
        const value = htmlRes.getElementsByClassName(dataSourceClass);
        expect(value[0].innerHTML).to.equal('Data Source: prov1', 'Could not find data source');
    });
});
