import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import {describe} from "@jest/globals";

const IAC_DAILY_ARTEFACT_ID = '1234';
const IAC_ADDITIONAL_CASES_ARTEFACT_ID = '12345'

const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const paragraphClass = 'govuk-body';
const courtListClass = 'site-address';
const courtRoomClass = 'govuk-accordion__section-button';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/iacDailyList.json'), 'utf-8');
const listData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const dailyListMetaData = JSON.parse(rawMetaData)[0];
dailyListMetaData.listType = 'IAC_DAILY_LIST';

const additionalCasesMetaData = JSON.parse(rawMetaData)[0];
additionalCasesMetaData.listType = 'IAC_DAILY_LIST_ADDITIONAL_CASES';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(listData);
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(IAC_DAILY_ARTEFACT_ID).returns(dailyListMetaData);
metadataStub.withArgs(IAC_ADDITIONAL_CASES_ARTEFACT_ID).returns(additionalCasesMetaData);

const iacDailyListUrl = '/iac-daily-list?artefactId='
    + IAC_DAILY_ARTEFACT_ID;
const iacDailyListAdditionalHearings = '/iac-daily-list-additional-cases?artefactId='
    + IAC_ADDITIONAL_CASES_ARTEFACT_ID;

describe('IAC daily cause list page', () => {
    describe.each([iacDailyListUrl, iacDailyListAdditionalHearings])("IAC Daily List with path %s", url => {
        beforeAll(async () => {
            await request(app)
                .get(url)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains(
                'First-tier Tribunal: Immigration and Asylum Chamber',
                'Could not find the header'
            );
        });

        it('should display summary heading', () => {
            const summary = htmlRes.getElementsByClassName(summaryHeading);
            expect(summary[0].innerHTML).contains('Important information', 'Could not find the display summary heading');
        });

        it('should display list for text', () => {
            const listForText = htmlRes.getElementsByClassName(paragraphClass)[4];
            expect(listForText.innerHTML).contains('List for ');
        });

        it('should display last updated text', () => {
            const listUpdatedText = htmlRes.getElementsByClassName(paragraphClass)[5];
            expect(listUpdatedText.innerHTML).contains('Last updated 31 August 2022 at 11am');
        });

        it('should display the search input box', () => {
            const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
            expect(searchInput[0].innerHTML).contains('Search Cases');
        });

        it('should display the court list name on the page', () => {
            const courtListText = htmlRes.getElementsByClassName(courtListClass);
            expect(courtListText[0].innerHTML).contains('Bail List');
            expect(courtListText[1].innerHTML).contains('Non Bail list');
        });

        it('should display the court room name on the page', () => {
            const courtRoomText = htmlRes.getElementsByClassName(courtRoomClass);
            expect(courtRoomText[0].innerHTML).contains('Room 1, Before Judge Test Name Presiding');
            expect(courtRoomText[1].innerHTML).contains('Room 1, Before Judge Test Name');
            expect(courtRoomText[2].innerHTML).contains(
                'Room 2, Before Judge Test Name Presiding, Judge Test Name 2, Judge Test Name 3'
            );
            expect(courtRoomText[3].innerHTML).contains('Room 2');
            expect(courtRoomText[4].innerHTML).contains('Hearing Room: Room 3');
        });

        it('should display data source text', () => {
            const listForText = htmlRes.getElementsByClassName(paragraphClass)[6];
            expect(listForText.innerHTML).contains('Data Source');
        });

        it('should display sitting channel if present', () => {
            const cell = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(cell[5].innerHTML).contains('Teams, Attended');
        });

        it('should display session channel if sitting channel is not present', () => {
            const cell = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(cell[26].innerHTML).contains('VIDEO HEARING,');
        });

        it('should display Respondent', () => {
            const cell = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(cell[3].innerHTML).contains('Test Name');
        });

        it('should display respondent using organisation', () => {
            const cell = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(cell[10].innerHTML).contains('Organisation Name');
        });

        it('should display hearing type if present', () => {
            const cell = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(cell[6].innerHTML).contains('Directions');
        });
    });
});
