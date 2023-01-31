import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';

const PAGE_URL = '/crown-firm-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const restrictionHeading = 'govuk-grid restriction-list-section';
const accordionClass = 'govuk-accordion__section-button';
const siteAddressClass = 'site-address';

const courtName = "Abergavenny Magistrates' Court";
const expectedHeader = courtName + ': Firm List';
const restrictionHeadingText = 'Restrictions on publishing or writing about these cases';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/crownFirmList.json'), 'utf-8');
const crownFirmListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(crownFirmListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

describe('Crown firm List page', () => {
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

    it('should display the site name for both courtHouses', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[0].innerHTML).contains('Colchester', 'Could not find the site name in section 1');
        expect(siteAddress[1].innerHTML).contains('Glasgow', 'Could not find the site name in section 1');
    });

    it('should display the "sitting at" section for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[1].innerHTML).contains('Sitting at', 'Could not find the Court name with Sitting at text');
        expect(siteAddress[0].innerHTML).contains('Sitting at', 'Could not find the Court name with Sitting at text');
    });

    it('should display accordion court name', () => {
        const accordion = htmlRes.getElementsByClassName(accordionClass);
        expect(accordion[0].innerHTML).to.contain('Courtroom 2:', 'Could not find the accordion heading');
    });

    it('should display second half of accordion title', () => {
        const accordion = htmlRes.getElementsByClassName(accordionClass);
        expect(accordion[0].innerHTML).to.contains(
            'Thomas Athorne, Reginald Cork',
            'Could not find the accordion heading'
        );
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases');
    });

    it('should display Sitting at time', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[0].innerHTML).contains('9am');
    });

    it('should display Case Reference', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[1].innerHTML).contains('I4Y416QE');
    });

    it('should display Defendant Name', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[2].innerHTML).equal('Cora, Mckinley');
    });

    it('should display Hearing Type', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[3].innerHTML).contains('Directions');
    });

    it('should display Case Sequence Indicator if it is there', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[4].innerHTML).contains('[4 of 5]');
    });

    it('should display Case name with Case Sequence Indicator if it is there', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[4].innerHTML).equal('8 hours [4 of 5]');
    });

    it('should display Prosecuting Authority', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[6].innerHTML).contains('Queen');
    });
});
