import request from 'supertest';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { LocationRequests } from '../../../main/resources/requests/locationRequests';
import { request as expressRequest } from 'express';

const PAGE_URL = '/location-name-search';
let htmlRes: Document;
const pageHeader = 'Subscribe by court or tribunal name';
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
const checkboxesCount = 12;

sinon.stub(LocationRequests.prototype, 'getAllLocations').returns(courtData);

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Court Name Search Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display a back button with the correct value', () => {
        const backLink = htmlRes.getElementsByClassName('govuk-back-link');
        expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
        expect(backLink[0].getAttribute('href')).equal('#', 'Back value does not contain correct link');
    });

    it('should contain the heading', () => {
        const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(pageHeading[0].innerHTML).contains(pageHeader, 'Page heading does not exist');
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(pageHeader, 'Page title does not match header');
    });

    it('should contain body text', () => {
        const pageBodyText = htmlRes.getElementsByClassName('govuk-body');
        expect(pageBodyText[0].innerHTML).contains(
            'Subscribe to receive hearings list by court or tribunal',
            'Page body text does not exist'
        );
    });

    it('should contain filter component', () => {
        const filterTitle = htmlRes.getElementsByClassName('govuk-heading-m');
        expect(filterTitle[0].innerHTML).contains('Filter', 'Filter title does not exist');
    });

    it('should contain selected filter component', () => {
        const filterTitle = htmlRes.getElementsByClassName('govuk-heading-m');
        expect(filterTitle[1].innerHTML).contains('Selected filter', 'Selected filter title does not exist');
    });

    it('should contain apply filters button', () => {
        const applyFiltersButton = htmlRes.getElementsByClassName('govuk-button');
        expect(applyFiltersButton[0].innerHTML).contains('Apply filters', 'Apply filters button does not exist');
    });

    it('should contain clear filters button', () => {
        const applyFiltersButton = htmlRes.querySelector('.moj-filter__heading-action .govuk-link');
        expect(applyFiltersButton.innerHTML).contains('Clear filters', 'Clear filters button does not exist');
    });

    it('should contain jurisdiction filter', () => {
        const jurisdictionLegend = htmlRes.getElementsByTagName('legend');
        expect(jurisdictionLegend[0].innerHTML).contains(
            'Type of court or tribunal',
            "Type of court or tribunal filter doesn't exist"
        );
    });

    it('should contain region filter', () => {
        const regionLegend = htmlRes.getElementsByTagName('legend');
        expect(regionLegend[1].innerHTML).contains('Region', "Region filter doesn't exist");
    });

    it('should contain 3 jurisdiction checkboxes', () => {
        const checkboxes = htmlRes.getElementsByName('Jurisdiction');
        expect(checkboxes.length).equal(3, 'Could not find jurisdiction checkboxes');
    });

    it('should contain 2 region checkboxes', () => {
        const checkboxes = htmlRes.getElementsByName('Region');
        expect(checkboxes.length).equal(3, 'Could not find region checkboxes');
    });

    it('should contain a back to top link, that links back up to the top', () => {
        const backToTopButton = htmlRes.getElementById('back-to-top-button');
        expect(backToTopButton.innerHTML).contains('Back to top', 'Back to top button does not exist');
        expect(backToTopButton.getAttribute('href')).contains('#');
    });

    it('should contain continue button', () => {
        const continueButton = htmlRes.getElementsByClassName('govuk-button');
        expect(continueButton[3].innerHTML).contains('Continue', 'Continue button does not exist');
    });

    it('should contain your selections component', () => {
        const selectionsTitle = htmlRes.getElementsByClassName('govuk-heading-m');
        expect(selectionsTitle[2].innerHTML).contains('Your selection(s)', 'Your selections title does not exist');
    });

    it('should contain selections counter', () => {
        const selectionText = htmlRes.getElementsByClassName('govuk-body');
        const counter = htmlRes.getElementById('selectionCount');
        expect(selectionText[1].innerHTML).contains('selected', 'Selection text does not exist');
        expect(counter.innerHTML).contains(0, 'Could not find counter value');
    });

    it('should contain letters that navigate to other sections of the page', () => {
        const alphabeticalLetters = htmlRes.getElementsByClassName('two-rows-alphabet');
        const letterA = htmlRes.getElementById('A-selector');
        expect(letterA.innerHTML).contains('A', 'Alphabetical link is not present');
        expect(alphabeticalLetters.length).equal(26, 'Could not find alphabet letters');
    });

    it('should contain court table rows', () => {
        const elementsCount = 12;
        const tableRows = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__row');
        expect(tableRows.length).equal(elementsCount, 'Could not find all table rows');
    });

    it(`should display ${checkboxesCount} subscription checkboxes`, () => {
        const checkboxes = htmlRes.getElementsByName('court-selections[]');
        expect(checkboxes.length).equal(checkboxesCount, 'Could not find all row checkboxes');
    });
});
