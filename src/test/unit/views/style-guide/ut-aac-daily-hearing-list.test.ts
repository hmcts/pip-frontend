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

describe('Upper Tribunal (Administrative Appeals Chamber) Daily Hearing List Page', () => {
    const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
    const rawData = fs.readFileSync(
        path.resolve(__dirname, '../../mocks/utAdministrativeAppealsChamberDailyHearingList.json'),
        'utf-8'
    );
    const jsonData = JSON.parse(rawData);

    sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
    const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

    describe('Upper Tribunal (Administrative Appeals Chamber) Daily Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/ut-aac-daily-hearing-list?artefactId=abc';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'UT_AAC_DAILY_HEARING_LIST';

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
                'Upper Tribunal (Administrative Appeals Chamber) Daily Hearing List - Court and Tribunal Hearings - GOV.UK',
                'Could not find the page title'
            );
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains(
                'Upper Tribunal (Administrative Appeals Chamber) Daily Hearing List',
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
            expect(text[5].innerHTML).contains('List for 14 February 2022');
        });

        it('should display list updated date text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[6].innerHTML).contains('Last updated 20 January 2025 at 9:30am');
        });

        it('should display important information heading', () => {
            const text = htmlRes.getElementsByClassName('govuk-details__summary-text');
            expect(text[0].innerHTML).contains('Important information');
        });

        it('should display contact information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[7].innerHTML).contains('Details');
        });

        it('should display information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[8].innerHTML).contains(
                'Lists are subject to change until 4:30pm. Any alterations after this time will be ' +
                    'telephoned or emailed direct to the parties or their legal representatives.'
            );
        });

        it('should display information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[9].innerHTML).contains('England and Wales');
        });

        it('should display information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[10].innerHTML).contains('Remote hearings via CVP');
        });

        it('should display information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[11].innerHTML).contains(
                'Hearings will be available to representatives of the media or any other member of the public, on their ' +
                    'request, and therefore will be a hearing conducted in ' +
                    'public in accordance with Rule 37 of the Tribunal Procedure (Upper Tribunal) Rules 2008.'
            );
        });

        it('should display information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[12].innerHTML).contains(
                'Any media representative or any other member of the public wishing to witness the hearing ' +
                    'will need to do so over the internet and provide an email address at which to be sent ' +
                    'an appropriate link for access.'
            );
        });

        it('should display information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[13].innerHTML).contains('Please contact adminappeals@justice.gov.uk.');
        });

        it('should display information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[14].innerHTML).contains('Scotland');
        });

        it('should display information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[15].innerHTML).contains('Remote hearings');
        });

        it('should display information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[16].innerHTML).contains(
                'When hearings are listed for Scotland the hearing will be available to representatives ' +
                    'of the media or any other member of the public, on their request, and therefore will ' +
                    'be a hearing conducted in public in accordance with Rule 37 of the Tribunal Procedure (Upper Tribunal) ' +
                    'Rules 2008. It will be organised and conducted using Cloud Video Platform (CVP). Any media representative ' +
                    'or any other member of the public wishing to witness the hearing will need to do so over the internet and ' +
                    'provide an email address at which to be sent an appropriate link for access. Please contact UTAACMailbox@justice.gov.uk.'
            );
        });

        it('should display Time header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[0].innerHTML).contains('Time');
        });

        it('should Appellant header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[1].innerHTML).contains('Appellant');
        });

        it('should Case Reference Number header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[2].innerHTML).contains('Case reference number');
        });

        it('should display Judge(s) header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[3].innerHTML).contains('Judge(s)');
        });

        it('should display Member(s) header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[4].innerHTML).contains('Member(s)');
        });

        it('should display Mode of Hearing header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[5].innerHTML).contains('Mode of hearing');
        });

        it('should display Venue header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[6].innerHTML).contains('Venue');
        });

        it('should display Additional Information header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[7].innerHTML).contains('Additional information');
        });

        it('should display Time cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[0].innerHTML).contains('10:15am');
        });

        it('should display Appellant cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[1].innerHTML).contains('Appellant 1');
        });

        it('should display Case Reference Number cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[2].innerHTML).contains('12345');
        });

        it('should display Judge data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[3].innerHTML).contains('Judge A');
        });

        it('should display Member cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[4].innerHTML).contains('Member A');
        });

        it('should display Mode of Hearing cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[5].innerHTML).contains('Mode of hearing 1');
        });

        it('should display Venue cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[6].innerHTML).contains('Venue 1');
        });

        it('should display Additional information cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[7].innerHTML).contains('Additional information 1');
        });

        it('should display data source text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[17].innerHTML).contains('Data Source: Prov1');
        });
    });
});
