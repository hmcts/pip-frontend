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

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/sendDailyHearingList.json'), 'utf-8');
const jsonData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'SEND_DAILY_HEARING_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

let htmlRes: Document;
const PAGE_URL = '/send-daily-hearing-list?artefactId=abc';
const WELSH_PAGE_URL = '/send-daily-hearing-list?artefactId=abc&lng=cy';

describe('First-tier Tribunal (Special Educational Needs and Disability) Daily Hearing List page in English', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(
            'First-tier Tribunal (Special Educational Needs and Disability) Daily Hearing List'
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
        expect(text[5].innerHTML).equals('List for 14 February 2022');
    });

    it('should display list updated date text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[6].innerHTML).equals('Last updated 20 January 2025 at 9:30am');
    });

    it('should display important information heading', () => {
        const text = htmlRes.getElementsByClassName('govuk-details__summary-text');
        expect(text[0].innerHTML).equals('Important information');
    });

    it('should display important information message 1', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[7].innerHTML).contains(
            'Special Educational Needs and Disability (SEND) Tribunal hearings ' +
                'are held in private and unless a request from the parties for the ' +
                'hearing to be heard in public has been approved, you will not be able to observe.'
        );
    });

    it('should display important information message 2', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[8].innerHTML).contains(
            'Private hearings do not allow anyone to observe ' +
                'remotely or in person. This includes members of the press.'
        );
    });

    it('should display important information message 3', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[9].innerHTML).contains(
            'Open justice is a fundamental principle of our justice system. ' +
                'To attend a public hearing using a remote link you must apply for permission to observe.'
        );
    });

    it('should display important information message 4', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].innerHTML).contains(
            'Requests to observe a public hearing that is taking ' +
                'place should be made in good time direct to: send@justice.gov.uk. ' +
                'You may be asked to provide further details.'
        );
    });

    it('should display important information message 5', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[11].innerHTML).contains(
            'The judge hearing the case will decide if it is appropriate for ' +
                'you to observe remotely. They will have regard to the interests of justice, ' +
                'the technical capacity for remote observation and what is necessary ' +
                'to secure the proper administration of justice.'
        );
    });

    it('should display Time header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[0].innerHTML).equals('Time');
    });

    it('should display Case reference number header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[1].innerHTML).equals('Case reference number');
    });

    it('should display Respondent header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[2].innerHTML).equals('Respondent');
    });

    it('should display Hearing Type header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[3].innerHTML).equals('Hearing type');
    });

    it('should display Venue header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[4].innerHTML).equals('Venue');
    });

    it('should display Hearing Time Estimate header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[5].innerHTML).equals('Time estimate');
    });

    it('should display Time cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[0].innerHTML).equals('10am');
    });

    it('should display Case reference number cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[1].innerHTML).equals('1234');
    });

    it('should display Respondent cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[2].innerHTML).equals('Respondent A');
    });

    it('should display Hearing Type cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[3].innerHTML).equals('Hearing Type A');
    });

    it('should display Venue cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[4].innerHTML).equals('Venue A');
    });

    it('should display Time Estimate cell data', () => {
        const cellText = htmlRes.getElementsByClassName(cell);
        expect(cellText[5].innerHTML).equals('2hrs');
    });

    it('should display data source text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[12].innerHTML).contains('Data Source: Prov1');
    });
});

describe('First-tier Tribunal (Special Educational Needs and Disability) Daily Hearing List page in Welsh', () => {
    beforeAll(async () => {
        await request(app)
            .get(WELSH_PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(
            'Rhestr o Wrandawiadau Dyddiol y Tribiwnlys Haen Gyntaf (Anghenion Addysgol Arbennig ac Anabledd)'
        );
    });

    it('should display fact link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[4].innerHTML).contains('Dod o hyd i fanylion cyswllt a gwybodaeth arall am lysoedd a thribiwnlysoedd yng Nghymru a Lloegr');
    });

    it('should display fact link', () => {
        const text = htmlRes.getElementsByClassName('govuk-link');
        expect(text[5].getAttribute('href')).eq('https://www.find-court-tribunal.service.gov.uk/');
    });

    it('should display list date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[5].innerHTML).equals('Rhestr ar gyfer 14 Chwefror 2022');
    });

    it('should display list updated date text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[6].innerHTML).equals('Diweddarwyd ddiwethaf 20 Ionawr 2025 am 9:30am');
    });

    it('should display important information heading', () => {
        const text = htmlRes.getElementsByClassName('govuk-details__summary-text');
        expect(text[0].innerHTML).equals('Gwybodaeth bwysig');
    });

    it('should display important information message 1', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[7].innerHTML).contains(
            'Cynhelir gwrandawiadau Tribiwnlys Anghenion Addysgol Arbennig ' +
                'ac Anabledd (SEND) yn breifat ac oni bai bod cais gan y partïon i wrandawiad ' +
                "gael ei wrando yn gyhoeddus wedi'i gymeradwyo, ni fyddwch yn gallu arsylwi."
        );
    });

    it('should display important information message 2', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[8].innerHTML).contains(
            'Nid yw gwrandawiadau preifat yn caniatáu i ' +
                "unrhyw un arsylwi o bell neu wyneb yn wyneb. Mae hyn yn cynnwys aelodau o'r wasg."
        );
    });

    it('should display important information message 3', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[9].innerHTML).contains(
            'Mae cyfiawnder agored yn un o egwyddorion sylfaenol ein system ' +
                'gyfiawnder. Ar gyfer mynychu gwrandawiad cyhoeddus gan ddefnyddio ' +
                'cyswllt o bell rhaid i chi wneud cais am ganiatâd i arsylwi.'
        );
    });

    it('should display important information message 4', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].innerHTML).contains(
            "Dylid gwneud ceisiadau i arsylwi gwrandawiad cyhoeddus sy'n cael " +
                'ei gynnal mewn pryd yn uniongyrchol at: send@justice.gov.uk. ' +
                'Efallai y gofynnir i chi ddarparu rhagor o fanylion.'
        );
    });

    it('should display important information message 5', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[11].innerHTML).contains(
            "Bydd y barnwr sy'n gwrando’r achos yn penderfynu a yw'n briodol i chi " +
                'arsylwi o bell. Byddant yn ystyried buddiannau cyfiawnder, y gallu technegol ' +
                "i arsylwi o bell a'r hyn sy'n angenrheidiol i sicrhau gweinyddiaeth briodol cyfiawnder."
        );
    });

    it('should display Time header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[0].innerHTML).equals('Amser');
    });

    it('should display Case reference number header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[1].innerHTML).equals('Cyfeirnod yr achos');
    });

    it('should display Respondent header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[2].innerHTML).equals('Atebydd');
    });

    it('should display Hearing Type header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[3].innerHTML).equals('Math o wrandawiad');
    });

    it('should display Venue header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[4].innerHTML).equals('Lleoliad');
    });

    it('should display Hearing Time Estimate header', () => {
        const headerCell = htmlRes.getElementsByClassName(tableHeader);
        expect(headerCell[5].innerHTML).equals("Amcangyfrif o'r amser");
    });
});
