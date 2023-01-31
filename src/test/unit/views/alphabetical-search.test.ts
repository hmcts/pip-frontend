import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { LocationRequests } from '../../../main/resources/requests/locationRequests';

const PAGE_URL = '/alphabetical-search';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);

sinon.stub(LocationRequests.prototype, 'getAllLocations').returns(courtData);

describe('Alphabetical Search page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains('Find a court or tribunal - alphabetical search', 'Page title does not match');
    });

    it('should display a back button with the correct value', () => {
        const backLink = htmlRes.getElementsByClassName('govuk-back-link');
        expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
        expect(backLink[0].getAttribute('href')).equal('#', 'Back value does not contain correct link');
    });

    it('should contain the find a court heading', () => {
        const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(pageHeading[0].innerHTML).contains('Find a court or tribunal', 'Page heading does not exist');
    });

    it('should contain letters that navigate to other sections of the page', () => {
        const alphabeticalLetters = htmlRes.getElementById('A-selector');

        expect(alphabeticalLetters.innerHTML).contains('A', 'Alphabetical link is not present');
        expect(alphabeticalLetters.getAttribute('href')).equal('#A');
    });

    it('should contain no link if letter has no hearings', () => {
        const alphabeticalLetters = htmlRes.getElementById('B-selector');

        expect(alphabeticalLetters.innerHTML).contains('B', 'Alphabetical link is not present');
        expect(alphabeticalLetters.getAttribute('href')).not.exist;
    });

    it('should contain the letter names in rows are present', () => {
        const lettersUsed = ['A', 'T', 'W'];
        lettersUsed.forEach(letter => {
            const row = htmlRes.getElementById(letter);
            expect(row.innerHTML).contains(letter);
        });
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

    it('should display the filter', () => {
        const filter = htmlRes.getElementsByClassName('moj-filter');
        expect(filter[0].innerHTML).contains('Filter');
    });

    it('should display filter options', () => {
        const fieldsets = htmlRes.getElementsByClassName('govuk-fieldset');
        expect(fieldsets[0].innerHTML).contains('Type of court or tribunal');
        expect(fieldsets[1].innerHTML).contains('Region');
    });

    it('should display filter options value', () => {
        const fieldsets = htmlRes.getElementsByClassName('govuk-fieldset');
        expect(fieldsets[0].innerHTML).contains('Crown');
        expect(fieldsets[1].innerHTML).contains('London');
    });
});
