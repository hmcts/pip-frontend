import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';

const PAGE_URL = '/iac-daily-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const summaryText = 'govuk-details__text';
const paragraphClass = 'govuk-body';
const courtListClass = 'site-address';
const courtRoomClass = 'govuk-accordion__section-button';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/iacDailyList.json'), 'utf-8');
const listData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(listData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

describe('IAC daily cause list page', () => {
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
            'First-tier Tribunal: Immigration and Asylum Chamber',
            'Could not find the header'
        );
    });

    it('should display summary heading', () => {
        const summary = htmlRes.getElementsByClassName(summaryHeading);
        expect(summary[0].innerHTML).contains('Important information', 'Could not find the display summary heading');
    });

    it('should display venue contact email and phone number in summary text', () => {
        const summary = htmlRes.getElementsByClassName(summaryText);
        expect(summary[0].innerHTML).contains('a@b.com 01234 123 123', 'Could not find the court name in summary text');
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
        expect(courtListText[0].innerHTML).contains('Bail list');
        expect(courtListText[1].innerHTML).contains('Float list');
    });

    it('should display the court room name on the page', () => {
        const courtRoomText = htmlRes.getElementsByClassName(courtRoomClass);
        expect(courtRoomText[0].innerHTML).contains('Room 1, Before Judge Jacobs');
        expect(courtRoomText[1].innerHTML).contains('Room 1, Before Magistrate Patel');
        expect(courtRoomText[2].innerHTML).contains('Room 2, Before Judge Mummy');
        expect(courtRoomText[3].innerHTML).contains('Room 2');
        expect(courtRoomText[4].innerHTML).contains('Hearing Room: Room 3');
    });

    it('should display data source text', () => {
        const listForText = htmlRes.getElementsByClassName(paragraphClass)[6];
        expect(listForText.innerHTML).contains('Data Source');
    });
});
