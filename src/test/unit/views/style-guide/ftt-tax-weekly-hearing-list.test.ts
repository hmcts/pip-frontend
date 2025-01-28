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

describe('Tax Chamber Weekly Hearing List Page', () => {
    const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
    const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/fttTaxWeeklyHearingList.json'), 'utf-8');
    const jsonData = JSON.parse(rawData);

    sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
    const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

    describe('Tax Chamber Weekly Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/ftt-tax-weekly-hearing-list?artefactId=abc';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'FTT_TAX_WEEKLY_HEARING_LIST';

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
                'First-tier Tribunal (Tax Chamber) Weekly Hearing List',
                'Could not find the header'
            );
        });

        it('should display list for text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[4].innerHTML).contains('List for week commencing 14 February 2022');
        });

        it('should display contact information 1 text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[5].innerHTML).contains(
                'Open justice is a fundamental principle of our justice system. You can attend ' +
                    'a public hearing in person, or you can apply for permission to observe remotely.'
            );
        });

        it('should display contact information 2 text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[6].innerHTML).contains(
                'Members of the public and the media can ask to join any telephone or video hearing remotely. ' +
                    'Contact the Tribunal before the hearing to ask for permission to attend by emailing taxappeals@justice.gov.uk.'
            );
        });

        it('should display contact information 3 text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[7].innerHTML).contains(
                'The subject line for the email should contain the following wording: “HEARING ACCESS REQUEST – ' +
                    '[Appellant’s name] v [Respondent’s name, for example HMRC] – [case reference] – [hearing date]”. ' +
                    'You will be sent instructions on how to join the hearing.'
            );
        });
        it('should display contact information 4 text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[8].innerHTML).contains(
                'The judge may refuse a request and can also decide a hearing must be held in private, ' +
                    'in such cases you will not be able to attend.'
            );
        });

        it('should display observation text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[9].innerHTML).contains(
                'Observe a court or tribunal hearing as a journalist, ' + 'researcher or member of the public'
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

        it('should Hearing Time header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[1].innerHTML).contains('Hearing time');
        });

        it('should Case Name header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[2].innerHTML).contains('Case name');
        });

        it('should display Case Reference Number header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[3].innerHTML).contains('Case reference number');
        });

        it('should display Judge header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[4].innerHTML).contains('Judge');
        });

        it('should display Member(s) header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[5].innerHTML).contains('Member(s)');
        });

        it('should display Date cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[0].innerHTML).contains('16 December 2024');
        });

        it('should display Hearing Time cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[1].innerHTML).contains('10am');
        });

        it('should display Case Name cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[2].innerHTML).contains('This is a case name');
        });

        it('should display Case Reference Number cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[3].innerHTML).contains('1234');
        });

        it('should display Judge data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[4].innerHTML).contains('Judge A');
        });

        it('should display Member(s) cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[5].innerHTML).contains('Member A');
        });

        it('should display data source text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[10].innerHTML).contains('Data Source: prov1');
        });
    });
});
