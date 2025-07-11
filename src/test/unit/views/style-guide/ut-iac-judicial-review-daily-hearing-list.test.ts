import sinon from 'sinon';
import request from 'supertest';
import {app} from '../../../../main/app';
import {expect} from 'chai';
import fs from 'fs';
import path from 'path';
import {PublicationService} from '../../../../main/service/PublicationService';

const headingClass = 'govuk-heading-l';
const bodyText = 'govuk-body';
const govukLinkClass = 'govuk-link';
const cell = 'govuk-table__cell';
const tableHeader = 'govuk-table__header';

describe('Upper Tribunal (Immigration and Asylum) Chamber Daily Hearing List Page', () => {
    const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
    const rawData = fs.readFileSync(
        path.resolve(__dirname, '../../mocks/utIacJudicialReviewDailyHearingList.json'),
        'utf-8'
    );

    const jsonData = JSON.parse(rawData);

    sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
    const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

    describe('UTIAC (JR) - Leeds Daily Hearing List page', () => {
        let htmlRes: Document;
        const PAGE_URL = '/ut-iac-jr-leeds-daily-hearing-list?artefactId=abc';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'UT_IAC_JR_LEEDS_DAILY_HEARING_LIST';

        metadataStub.withArgs('abc').returns(metaData);

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
                'Upper Tribunal (Immigration and Asylum) Chamber - Judicial Review: Leeds Daily Hearing List'
            );
        });

        it('should display list date', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[4].innerHTML).contains('List for 14 February 2022');
        });

        it('should display list updated date text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[5].innerHTML).contains('Last updated 20 January 2025 at 9:30am');
        });

        it('should display important information heading', () => {
            const text = htmlRes.getElementsByClassName('govuk-details__summary-text');
            expect(text[0].innerHTML).contains('Important information');
        });

        it('should display list update message', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[6].innerHTML).contains(
                'The following list is subject to change until 4:30pm. Any alterations after this time will be telephoned or emailed direct to the parties or their legal representatives.'
            );
        });

        it('should display observe hearing link text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[7].innerHTML).contains(
                'Observe a court or tribunal hearing as a journalist, researcher or member of the public'
            );
        });

        it('should display observe hearing link', () => {
            const text = htmlRes.getElementsByClassName(govukLinkClass);
            expect(text[5].getAttribute('href')).eq('https://www.gov.uk/guidance/observe-a-court-or-tribunal-hearing');
        });

        it('should display Venue header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[0].innerHTML).equals('Venue');
        });

        it('should display Judges(s) header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[1].innerHTML).equals('Judge(s)');
        });

        it('should display Hearing Time header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[2].innerHTML).equals('Hearing time');
        });

        it('should display Case Reference Number header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[3].innerHTML).equals('Case reference number');
        });

        it('should display Case Title header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[4].innerHTML).equals('Case title');
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
            expect(cellText[0].innerHTML).contains('This is a venue name');
        });

        it('should display Judge(s) cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[1].innerHTML).equals('Judge A');
        });

        it('should display Hearing Time cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[2].innerHTML).equals('10:30am');
        });

        it('should display Case Reference Number cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[3].innerHTML).equals('1234');
        });

        it('should display Case Title cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[4].innerHTML).equals('Case A');
        });

        it('should display Hearing Type cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[5].innerHTML).equals('Hearing type A');
        });

        it('should display Additional information cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[6].innerHTML).contains('This is additional information');
        });

        it('should display data source text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[8].innerHTML).contains('Data Source: Prov1');
        });
    });

    describe('UTIAC (JR) - Manchester Daily Hearing List page', () => {
        let htmlRes: Document;
        const PAGE_URL = '/ut-iac-jr-manchester-daily-hearing-list?artefactId=def';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'UT_IAC_JR_MANCHESTER_DAILY_HEARING_LIST';

        metadataStub.withArgs('def').returns(metaData);

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
                'Upper Tribunal (Immigration and Asylum) Chamber - Judicial Review: Manchester Daily Hearing List',
                'Could not find the header'
            );
        });
    });

    describe('UTIAC (JR) - Birmingham Daily Hearing List page', () => {
        let htmlRes: Document;
        const PAGE_URL = '/ut-iac-jr-birmingham-daily-hearing-list?artefactId=ghi';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'UT_IAC_JR_BIRMINGHAM_DAILY_HEARING_LIST';

        metadataStub.withArgs('ghi').returns(metaData);

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
                'Upper Tribunal (Immigration and Asylum) Chamber - Judicial Review: Birmingham Daily Hearing List',
                'Could not find the header'
            );
        });
    });

    describe('UTIAC (JR) - Cardiff Daily Hearing List page', () => {
        let htmlRes: Document;
        const PAGE_URL = '/ut-iac-jr-cardiff-daily-hearing-list?artefactId=mno';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'UT_IAC_JR_CARDIFF_DAILY_HEARING_LIST';

        metadataStub.withArgs('mno').returns(metaData);

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
                'Upper Tribunal (Immigration and Asylum) Chamber - Judicial Review: Bristol and Cardiff Daily Hearing List',
                'Could not find the header'
            );
        });
    });
});
