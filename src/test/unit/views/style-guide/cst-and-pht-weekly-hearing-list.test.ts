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

describe('CST and PHT Weekly Hearing List Page', () => {
    const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
    const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/cstAndPhtWeeklyHearingList.json'), 'utf-8');
    const jsonData = JSON.parse(rawData);

    sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
    const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

    describe('CST Weekly Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/cst-weekly-hearing-list?artefactId=abc';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'CST_WEEKLY_HEARING_LIST';

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
                'Care Standards Tribunal Weekly Hearing List',
                'Could not find the header'
            );
        });

        it('should display list for text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[4].innerHTML).contains('List for 14 February 2022');
        });

        it('should display contact information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[5].innerHTML).contains(
                'Please contact the Care Standards Office at cst@justice.gov.uk' +
                    ' for details of how to access video hearings.'
            );
        });

        it('should display observation text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[6].innerHTML).contains(
                'Observe a court or tribunal hearing as a journalist, researcher or member of the public'
            );
        });

        it('should display observation link', () => {
            const text = htmlRes.getElementsByClassName(govukLinkClass);
            expect(text[5].getAttribute('href')).eq('https://www.gov.uk/guidance/observe-a-court-or-tribunal-hearing');
        });

        it('should display Date header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[0].innerHTML).contains('Date');
        });

        it('should display Case Name header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[1].innerHTML).contains('Case name');
        });

        it('should display Hearing Length header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[2].innerHTML).contains('Hearing length');
        });

        it('should display Hearing Type header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[3].innerHTML).contains('Hearing type');
        });

        it('should display Venue header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[4].innerHTML).contains('Venue');
        });

        it('should display Additional Information header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[5].innerHTML).contains('Additional information');
        });

        it('should display Date cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[0].innerHTML).contains('12 January 2024');
        });

        it('should display Case name cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[1].innerHTML).contains('Case Name 1');
        });

        it('should display Hearing length cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[2].innerHTML).contains('Hearing Length 1');
        });

        it('should display Hearing type cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[3].innerHTML).contains('Hearing Type 1');
        });

        it('should display Venue cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[4].innerHTML).contains('This is a venue 1');
        });

        it('should display Additional information cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[5].innerHTML).contains('Additional Information 1');
        });

        it('should display data source text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[7].innerHTML).contains('Data Source: prov1');
        });
    });

    describe('PHT Weekly Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/pht-weekly-hearing-list?artefactId=def';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'PHT_WEEKLY_HEARING_LIST';

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
                'Primary Health Tribunal Weekly Hearing List',
                'Could not find the header'
            );
        });

        it('should display contact information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[5].innerHTML).contains(
                'Please contact the Primary Health Lists at primaryhealthlists@justice.gov.uk for ' +
                    'details of how to access video hearings.'
            );
        });
    });
});
