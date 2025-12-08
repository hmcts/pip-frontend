import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';

const headingClass = 'govuk-heading-l';
const bodyText = 'govuk-body';
const govukLinkClass = 'govuk-link';
const cell = 'govuk-table__cell';
const tableHeader = 'govuk-table__header';

describe('SIAC, POAC and PAAC Weekly Hearing List Page', () => {
    const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
    const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/siacWeeklyHearingList.json'), 'utf-8');
    const jsonData = JSON.parse(rawData);

    sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
    const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

    describe('SIAC Weekly Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/siac-weekly-hearing-list?artefactId=abc';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'SIAC_WEEKLY_HEARING_LIST';

        metadataStub.withArgs('abc').returns(metaData);

        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(
                'Special Immigration Appeals Commission Weekly Hearing List - Court and Tribunal Hearings – GOV.UK',
                'Could not find the page title'
            );
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains(
                'Special Immigration Appeals Commission Weekly Hearing List',
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

        it('should display list for text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[5].innerHTML).contains('List for week commencing 14 February 2022');
        });

        it('should display list updated date text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[6].innerHTML).contains('Last updated 20 January 2025 at 9:30am');
        });

        it('should display important information heading', () => {
            const text = htmlRes.getElementsByClassName('govuk-details__summary-text');
            expect(text[0].innerHTML).contains('Important information');
        });

        it('should display contact information 1 text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[7].innerHTML).contains(
                'The tribunal sometimes uses reference numbers or initials to protect the anonymity of those involved in the appeal.'
            );
        });

        it('should display contact information 2 text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[8].innerHTML).contains(
                'All hearings take place at Field House, 15-25 Bream’s Buildings, London EC4A 1DZ.'
            );
        });

        it('should display expect coming to a court or tribunal text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[9].innerHTML).contains('Find out what to expect coming to a court or tribunal');
        });

        it('should display expect coming to a court or tribunal link', () => {
            const text = htmlRes.getElementsByClassName(govukLinkClass);
            expect(text[6].getAttribute('href')).eq(
                'https://www.gov.uk/guidance/what-to-expect-coming-to-a-court-or-tribunal'
            );
        });

        it('should display Date header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[0].innerHTML).contains('Date');
        });

        it('should display Time header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[1].innerHTML).contains('Time');
        });

        it('should display Appellant header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[2].innerHTML).contains('Appellant');
        });

        it('should display Case reference number header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[3].innerHTML).contains('Case reference number');
        });

        it('should display Hearing type header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[4].innerHTML).contains('Hearing type');
        });

        it('should display Courtroom header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[5].innerHTML).contains('Courtroom');
        });

        it('should display Additional Information header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[6].innerHTML).contains('Additional information');
        });

        it('should display Date cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[0].innerHTML).contains('11 December 2024');
        });

        it('should display Time cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[1].innerHTML).contains('10:15am');
        });

        it('should display Appellant cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[2].innerHTML).contains('Appellant 1');
        });

        it('should display Case reference number cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[3].innerHTML).contains('1234');
        });

        it('should display Hearing type data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[4].innerHTML).contains('Type of Hearing 1');
        });

        it('should display Courtroom cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[5].innerHTML).contains('Courtroom 1');
        });

        it('should display Additional information cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[6].innerHTML).contains('Additional Information 1');
        });

        it('should display data source text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[10].innerHTML).contains('Data Source: Prov1');
        });
    });

    describe('Proscribed Organisations Appeal Commission Weekly Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/poac-weekly-hearing-list?artefactId=xyz';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'POAC_WEEKLY_HEARING_LIST';

        metadataStub.withArgs('xyz').returns(metaData);

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
                'Proscribed Organisations Appeal Commission Weekly Hearing List',
                'Could not find the header'
            );
        });
    });

    describe('Pathogens Access Appeal Commission Weekly Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/paac-weekly-hearing-list?artefactId=def';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'PAAC_WEEKLY_HEARING_LIST';

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
                'Pathogens Access Appeal Commission Weekly Hearing List',
                'Could not find the header'
            );
        });
    });
});
