import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';

const headingClass = 'govuk-heading-l';
const bodyText = 'govuk-body';
const cell = 'govuk-table__cell';
const tableHeader = 'govuk-table__header';

const rawData = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/countyCourtLondonCivilDailyCauseList.json'),
    'utf-8'
);
const jsonData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'COUNTY_COURT_LONDON_CIVIL_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

let htmlRes: Document;
const PAGE_URL = '/county-court-london-civil-daily-cause-list?artefactId=abc&lng=en';
const WELSH_PAGE_URL = '/county-court-london-civil-daily-cause-list?artefactId=abc&lng=cy';

describe('County Court at Central London Civil Daily Cause List page in English', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains('County Court at Central London Civil Daily Cause List');
    });

    it('should display venue', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[4].innerHTML).equals('Royal Courts of Justice');
        expect(text[5].innerHTML).equals('Thomas More Building');
        expect(text[6].innerHTML).equals('Strand, London');
        expect(text[7].innerHTML).equals('WC2A 2LL');
    });

    it('should display list date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[8].innerHTML).equals('List for 14 February 2022');
    });

    it('should display list updated date text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[9].innerHTML).equals('Last updated 20 January 2025 at 9:30am');
    });

    it('should display important information heading', () => {
        const text = htmlRes.getElementsByClassName('govuk-details__summary-text');
        expect(text[0].innerHTML).equals('Important information');
    });

    it('should display important information message part 1', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].innerHTML).contains(
            'Central London County Court and Mayors &amp; City of London Court – Hearings for the County Court at ' +
                'Central London will be heard at the Thomas More Building, located in the Royal Courts of Justice. ' +
                'Cases are also listed at Mayors &amp; City of London Court, Guildhall Buildings, Basinghall Street, ' +
                'London, EC2V 5AR. Due to judicial availability, cases may be moved between the County Court at ' +
                'Central London and Mayors &amp; City of London Court. ' +
                'Please ensure you check the cause lists for Central ' +
                'London County Court and Mayors and City of London Court the day prior to your hearing. ' +
                'Lists aim to be published by 1700.'
        );
    });

    it('should display important information message part 2', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[11].innerHTML).contains(
            'Requests for the media and others, including legal bloggers, should be made to County Court at ' +
                'Central London via enquiries.centrallondon.countycourt@justice.gov.uk ' +
                'or Mayors and City of London Court via enquiries.centrallondon.countycourt@justice.gov.uk. ' +
                'Arrangements will then be made for you to attend. When considering the use of telephone and video ' +
                'technology the judiciary will have regard to the principles of open justice. The Court may exclude ' +
                'observers where necessary to secure the proper administration of Justice.'
        );
    });

    it('should display Venue header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[0].innerHTML).equals('Venue');
    });

    it('should display Judge header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[1].innerHTML).equals('Judge');
    });

    it('should display Time header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[2].innerHTML).equals('Time');
    });

    it('should display Case Number header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[3].innerHTML).equals('Case number');
    });

    it('should display Case Details header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[4].innerHTML).equals('Case details');
    });

    it('should display Hearing Type header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[5].innerHTML).equals('Hearing type');
    });

    it('should display Additional Information header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[6].innerHTML).equals('Additional information');
    });

    it('should display Venue cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[0].innerHTML).equals('Venue A');
    });

    it('should display Judge cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[1].innerHTML).equals('Judge A');
    });

    it('should display Time cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[2].innerHTML).equals('9am');
    });

    it('should display Case Number cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[3].innerHTML).equals('12345');
    });

    it('should display Case Details cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[4].innerHTML).equals('Case details A');
    });

    it('should display Hearing Type cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[5].innerHTML).equals('Hearing type A');
    });

    it('should display Additional Information cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[6].innerHTML).equals('This is additional information');
    });

    it('should display data source text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[12].innerHTML).contains('Data Source: Prov1');
    });
});

describe('County Court at Central London Civil Daily Cause List page in Welsh', () => {
    beforeAll(async () => {
        await request(app)
            .get(WELSH_PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains('Rhestr Achosion Dyddiol Sifil yn y Llys Sirol yng Nghanol Llundain');
    });

    it('should display venue', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[4].innerHTML).equals('Llysoedd Barn Brenhinol');
        expect(text[5].innerHTML).equals('Thomas More Building');
        expect(text[6].innerHTML).equals('Strand, London');
        expect(text[7].innerHTML).equals('WC2A 2LL');
    });

    it('should display list date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[8].innerHTML).equals('Rhestr ar gyfer 14 Chwefror 2022');
    });

    it('should display list updated date text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[9].innerHTML).equals('Diweddarwyd ddiwethaf 20 Ionawr 2025 am 9:30am');
    });

    it('should display important information heading', () => {
        const text = htmlRes.getElementsByClassName('govuk-details__summary-text');
        expect(text[0].innerHTML).equals('Gwybodaeth bwysig');
    });

    it('should display important information message part 1', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].innerHTML).contains(
            'Llys Sirol Canol Llundain a Llys Maer a Dinas Llundain – Bydd gwrandawiadau ar gyfer ' +
                'Llys Sirol Canol Llundain yn cael eu gwrando yn Adeilad Thomas More, ' +
                'sydd wedi’i leoli yn y Llysoedd Barn Brenhinol. Rhestrir achosion hefyd yn ' +
                'Llys Maer a Dinas Llundain, Adeiladau’r Guildhall, Stryd Basinghall, ' +
                'Llundain, EC2V 5AR. Oherwydd argaeledd barnwrol, gellir symud achosion rhwng ' +
                'y Llys Sirol yng Nghanol Llundain a Llys Maer a Dinas Llundain. Gwnewch yn ' +
                'siŵr eich bod yn gwirio rhestrau achosion Llys Sirol Canol Llundain a ' +
                'Llys Maer a Dinas Llundain y diwrnod cyn eich gwrandawiad. Anelir at gyhoeddi rhestrau erbyn 5pm.'
        );
    });

    it('should display important information message part 2', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[11].innerHTML).contains(
            'Dylid gwneud ceisiadau ar gyfer y cyfryngau ac eraill, gan gynnwys blogwyr cyfreithiol, ' +
                'i Lys Sirol Canol Llundain drwy enquiries.centrallondon.countycourt@justice.gov.uk ' +
                'neu Lys Maer a Dinas Llundain drwy enquiries.centrallondon.countycourt@justice.gov.uk. ' +
                'Yna gwneir trefniadau i chi fynychu. Wrth ystyried y defnydd o dechnoleg ffôn a fideo, ' +
                'bydd y farnwriaeth yn ystyried egwyddorion cyfiawnder agored. Gall y llys eithrio arsylwyr ' +
                'lle bo angen i sicrhau gweinyddiaeth briodol cyfiawnder.'
        );
    });

    it('should display Venue header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[0].innerHTML).equals('Lleoliad');
    });

    it('should display Judge header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[1].innerHTML).equals('Barnwr');
    });

    it('should display Time header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[2].innerHTML).equals('Amser');
    });

    it('should display Case Number header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[3].innerHTML).equals('Rhif yr achos');
    });

    it('should display Case Details header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[4].innerHTML).equals('Manylion yr achos');
    });

    it('should display Hearing Type header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[5].innerHTML).equals('Math o Wrandawiad');
    });

    it('should display Additional Information header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[6].innerHTML).equals('Gwybodaeth ychwanegol');
    });

    it('should display data source text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[12].innerHTML).contains('Ffynhonnell Data: Prov1');
    });
});
