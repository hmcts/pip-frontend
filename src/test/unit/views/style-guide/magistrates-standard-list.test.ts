import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';

const PAGE_URL = '/magistrates-standard-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const bodyText = 'govuk-body';
const restrictionHeading = 'govuk-grid restriction-list-section';
const siteAddressClass = 'site-address';
const linkedCasesClass = 'linked-cases-heading';
const accordionClass = 'govuk-accordion__section-button';

const courtName = "Abergavenny Magistrates' Court";
const expectedHeader = 'Magistrates Standard List for ' + courtName;
const restrictionHeadingText = 'Restrictions on publishing or writing about these cases';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/magistratesStandardList.json'), 'utf-8');
const magistrateStandardListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'MAGISTRATES_STANDARD_LIST';

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

describe('Magistrate Standard List page', () => {
    const getJsonStub = sinon
        .stub(PublicationService.prototype, 'getIndividualPublicationJson')
        .returns(magistrateStandardListData);
    const getMetadataStub = sinon
        .stub(PublicationService.prototype, 'getIndividualPublicationMetadata')
        .returns(metaData);

    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    afterAll(() => {
        getJsonStub.restore();
        getMetadataStub.restore();
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should display fact link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[0].innerHTML).contains('Find contact details and other information about courts and tribunals');
    });

    it('should display fact link', () => {
        const text = htmlRes.getElementsByClassName('govuk-link');
        expect(text[2].getAttribute('href')).eq('https://www.find-court-tribunal.service.gov.uk/');
    });

    it('should display restriction bullet points', () => {
        const bullets = htmlRes.getElementsByClassName('govuk-list--bullet')[0];
        expect(bullets.innerHTML).to.contain('the court directly');
        expect(bullets.innerHTML).to.contain('HM Courts and Tribunals Service on 0330 808 4407');
    });

    it('should display publication date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[2].innerHTML).contains(
            'Last updated: 01 December 2023 at 11:30pm',
            'Could not find the publication date'
        );
    });

    it('should display venue address', () => {
        const venue = htmlRes.getElementsByClassName('venue-address')[0];
        expect(venue.innerHTML).to.contain('Address Line 1');
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

    it('should display the Court House if present', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);

        expect(siteAddress[0].innerHTML).contains('PRESTON', 'Could not find the court house header');
    });

    it('should display the LJA if present', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);

        expect(siteAddress[1].innerHTML).contains('LJA: Local Justice Area A', 'Could not find the local justice area');
    });

    it('should display the site name for both sections', () => {
        const siteAddress = htmlRes.getElementsByClassName(siteAddressClass);
        expect(siteAddress[2].innerHTML).contains(
            'Courtroom 1: Test Name, Test Name',
            'Could not find the site name in section 1'
        );
    });

    it('should display party heading', () => {
        const accordion = htmlRes.getElementsByClassName(accordionClass);
        expect(accordion[0].innerHTML).to.contains(
            'Name: Surname1, Forename1 MiddleName (male)*',
            'Could not find the accordion heading'
        );
    });

    it('should display sitting at', () => {
        const sittingHeading = htmlRes.getElementsByClassName(linkedCasesClass);
        expect(sittingHeading[0].innerHTML).to.contains(
            'Sitting at 1:30pm [2 of 3]',
            'Could not find the accordion heading'
        );
    });

    it('should display DOB and Age if both present', () => {
        const div = htmlRes.getElementsByClassName('govuk-grid-column-two-thirds no_padding')[0];
        expect(div.innerHTML).to.contain('DOB and Age');
        expect(div.innerHTML).to.match(/01\/01\/1950.*20/);
    });

    it('should display address if present', () => {
        const div = htmlRes.getElementsByClassName('govuk-grid-column-two-thirds no_padding')[0];
        expect(div.innerHTML).to.contain('Address Line 1, Address Line 2');
    });

    it('should display prosecuting authority if present', () => {
        const div = htmlRes.getElementsByClassName('govuk-grid-column-two-thirds no_padding')[0];
        expect(div.innerHTML).to.contain('Prosecuting Authority Name');
    });

    it('should display attendance method if present', () => {
        const div = htmlRes.getElementsByClassName('govuk-grid-column-two-thirds no_padding')[0];
        expect(div.innerHTML).to.contain('VIDEO HEARING');
    });

    it('should display reference if present', () => {
        const div = htmlRes.getElementsByClassName('govuk-grid-column-one-third')[0];
        expect(div.innerHTML).to.contain('45684548');
    });

    it('should display application type if present', () => {
        const div = htmlRes.getElementsByClassName('govuk-grid-column-one-third')[2];
        expect(div.innerHTML).to.contain('Application Type 1');
    });

    it('should not display application type if not present', () => {
        const div = htmlRes.getElementsByClassName('govuk-grid-column-one-third')[0];
        expect(div.innerHTML).to.not.contain('Application Type');
    });

    it('should display asn if present', () => {
        const div = htmlRes.getElementsByClassName('govuk-grid-column-one-third')[0];
        expect(div.innerHTML).to.contain('AB12345');
    });

    it('should display hearing type if present', () => {
        const div = htmlRes.getElementsByClassName('govuk-grid-column-one-third')[0];
        expect(div.innerHTML).to.contain('mda');
    });

    it('should display panel if present', () => {
        const div = htmlRes.getElementsByClassName('govuk-grid-column-one-third')[0];
        expect(div.innerHTML).to.contain('ADULT');
    });

    it('should display correct offence title', () => {
        const cell = htmlRes.getElementsByClassName('offence-summary');
        expect(cell[0].innerHTML).contains('1. ');
        expect(cell[1].innerHTML).contains('dd01-01');
        expect(cell[2].innerHTML).contains(' - ');
        expect(cell[3].innerHTML).contains('drink driving');
    });

    it('should display offence wording', () => {
        const offence = htmlRes.getElementsByClassName('govuk-details__text');
        expect(offence[0].innerHTML).contains('driving whilst under the influence of alcohol');
    });

    it('should display offence legislation if present', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[2].innerHTML).contains('This is a legislation');
    });

    it('should display offence max penalty if present', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[4].innerHTML).contains('100yrs');
    });

    it('should display plea if present', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[6].innerHTML).contains('NOT_GUILTY');
    });

    it('should display date of plea if present', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[8].innerHTML).contains('27/06/2026');
    });

    it('should display convicted on if present', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[10].innerHTML).contains('01/05/2026');
    });

    it('should display adjourned from on if present', () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[12].innerHTML).contains('02/05/2026 - For the trial');
    });

    it('should display the go back button', () => {
        const goBack = htmlRes.querySelector('.govuk-back-link');
        expect(goBack).to.exist;
    });

    it('should display data source and provenance', () => {
        const body = htmlRes.getElementsByClassName('govuk-body govuk-!-font-size-14')[0];
        expect(body.innerHTML).to.contain('Data Source: Prov1');
    });
});

describe('Magistrate Standard List page with custom data', () => {
    async function renderPageWithData(overrides?: (data: any) => void): Promise<Document> {
        const clone = JSON.parse(JSON.stringify(magistrateStandardListData));
        if (overrides) {
            overrides(clone);
        }
        const stubJson = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(clone);
        const stubMeta = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
        const res = await request(app).get(PAGE_URL);
        stubJson.restore();
        stubMeta.restore();
        return new DOMParser().parseFromString(res.text, 'text/html');
    }

    it('should not display LJA if not present', async () => {
        const doc = await renderPageWithData(clone => {
            delete clone.courtLists[0].courtHouse.lja;
        });
        const ljaHeaders = Array.from(doc.getElementsByClassName('site-address')).filter(el =>
            el.textContent.includes('Local Justice Area A')
        );
        expect(ljaHeaders.length).to.equal(0);
    });

    it('should display only DOB if age is missing', async () => {
        const doc = await renderPageWithData(clone => {
            delete clone.courtLists[0].courtHouse.courtRoom[0].session[0].sittings[0].hearing[0].case[0].party[0]
                .individualDetails.age;
        });
        const div = doc.getElementsByClassName('govuk-grid-column-two-thirds no_padding')[0];
        expect(div.innerHTML).to.contain('DOB and Age');
        expect(div.innerHTML).to.contain('01/01/1950');
        expect(div.innerHTML).to.not.match(/Age\s*\d+/);
    });

    it('should display only Age if DOB is missing', async () => {
        const doc = await renderPageWithData(clone => {
            delete clone.courtLists[0].courtHouse.courtRoom[0].session[0].sittings[0].hearing[0].case[0].party[0]
                .individualDetails.dateOfBirth;
        });
        const div = doc.getElementsByClassName('govuk-grid-column-two-thirds no_padding')[0];
        expect(div.innerHTML).to.contain('DOB and Age');
        expect(div.innerHTML).to.contain('Age: 20');
    });
});
