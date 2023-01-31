import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { LocationRequests } from '../../../main/resources/requests/locationRequests';

const PAGE_URL = '/live-case-alphabet-search';
const expectedHeader = 'Live hearing updates - select a court';
const expectedTableHeader = 'Crown courts in England and Wales';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const hearingsData = JSON.parse(rawData);

sinon.stub(LocationRequests.prototype, 'getFilteredCourts').returns(hearingsData);

describe.skip('Alphabetical Search page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display a back button with the correct value', () => {
        const backLink = htmlRes.getElementsByClassName('govuk-back-link');
        expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
        expect(backLink[0].getAttribute('href')).equal('#', 'Back value does not contain correct link');
    });

    it('should contain the find a court heading', () => {
        const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(pageHeading[0].innerHTML).contains(expectedHeader, 'Page heading does not exist');
    });

    it('should contain letters that navigate to other sections of the page', () => {
        const alphabeticalLetters = htmlRes.getElementsByClassName('govuk-link--no-visited-state');

        expect(alphabeticalLetters[0].innerHTML).contains('A', 'Alphabetical link is not present');
        expect(alphabeticalLetters[0].getAttribute('href')).equal('#A');
    });

    it('should contain no link if letter has no hearings', () => {
        const alphabeticalLetters = htmlRes.getElementsByClassName('govuk-link--no-underline');

        expect(alphabeticalLetters[1].innerHTML).contains('C', 'Alphabetical link is not present');
        expect(alphabeticalLetters[1].getAttribute('href')).not.exist;
    });

    it('should contain the correct headers', () => {
        const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
        expect(tableHeaders[0].innerHTML).contains(expectedTableHeader, 'Table header is not present');
    });

    it('should contain the letter names in rows are present', () => {
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i);
            const row = htmlRes.getElementById(`${letter}-selector`);
            expect(row.innerHTML).contains(letter);
        }
    });

    it("should have the first cell containing Abergavenny Magistrates' Court", () => {
        const cell = htmlRes.getElementsByClassName('govuk-table__cell');
        expect(cell[0].innerHTML).contains("Abergavenny Magistrates' Court");
    });

    it('should contain a back to top link, that links back up to the top', () => {
        const backToTopButton = htmlRes.getElementById('back-to-top-button');
        expect(backToTopButton.innerHTML).contains('Back to top');
        expect(backToTopButton.getAttribute('href')).contains('#');
    });
});
