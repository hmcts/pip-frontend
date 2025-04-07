import request from 'supertest';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { LocationRequests } from '../../../main/resources/requests/LocationRequests';
import { request as expressRequest } from 'express';

const PAGE_URL = '/location-name-search';
let htmlRes: Document;
const pageHeader = 'Subscribe by court or tribunal name';
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
const checkboxesCount = 12;

sinon.stub(LocationRequests.prototype, 'getAllLocations').returns(courtData);

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Location Name Search Page', () => {
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
        expect(pageTitle).contains(
            'Add email subscription - Subscribe by court or tribunal name - Court and Tribunal Hearings - GOV.UK',
            'Page title does not match header'
        );
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

    it('should contain filter sections', () => {
        const filters = htmlRes.getElementsByClassName('govuk-fieldset__legend');
        expect(filters.length).equal(6, 'Filter count does not match');
        expect(filters[0].innerHTML).contains('Jurisdiction', 'Jurisdiction filter does not match');
        expect(filters[1].innerHTML).contains('Civil type', 'Jurisdiction type filter does not match');
        expect(filters[2].innerHTML).contains('Crime type', 'Jurisdiction type filter does not match');
        expect(filters[3].innerHTML).contains('Family type', 'Jurisdiction type filter does not match');
        expect(filters[4].innerHTML).contains('Tribunal type', 'Jurisdiction type filter does not match');
        expect(filters[5].innerHTML).contains('Region', 'Region filter does not match');
    });

    it('should contain always-hide filter sections', () => {
        const filters = htmlRes.getElementsByClassName('always-hide');
        expect(filters.length).equal(4, 'Filter count does not match');
        expect(filters[0].innerHTML).contains('Civil type', 'Jurisdiction type filter does not match');
        expect(filters[1].innerHTML).contains('Crime type', 'Jurisdiction type filter does not match');
        expect(filters[2].innerHTML).contains('Family type', 'Jurisdiction type filter does not match');
        expect(filters[3].innerHTML).contains('Tribunal type', 'Jurisdiction type filter does not match');
    });

    it('should contain jurisdiction filter checkboxes', () => {
        const checkboxes = htmlRes.getElementsByName('Jurisdiction');
        expect(checkboxes.length).equal(3, 'Jurisdiction filter does not match');
    });

    it('should not contain civil type filter checkboxes', () => {
        const checkboxes = htmlRes.getElementsByName('Civil');
        expect(checkboxes.length).equal(0, 'Civil type filter does not match');
    });

    it('should contain crime type filter checkboxes', () => {
        const checkboxes = htmlRes.getElementsByName('Crime');
        expect(checkboxes.length).equal(2, 'Crime type filter does not match');
    });

    it('should contain family type filter checkboxes', () => {
        const checkboxes = htmlRes.getElementsByName('Family');
        expect(checkboxes.length).equal(1, 'Family type filter does not match');
    });

    it('should contain tribunal type filter checkboxes', () => {
        const checkboxes = htmlRes.getElementsByName('Tribunal');
        expect(checkboxes.length).equal(1, 'Tribunal type filter does not match');
    });

    it('should contain region filter checkboxes', () => {
        const checkboxes = htmlRes.getElementsByName('Region');
        expect(checkboxes.length).equal(3, 'Region filter does not match');
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
        expect(selectionsTitle[2].innerHTML).contains('Total selected', 'Your selections title does not exist');
    });

    it('should contain court table rows', () => {
        const tableRows = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__row');
        expect(tableRows.length).equal(12, 'Could not find all table rows');
    });

    it(`should display ${checkboxesCount} subscription checkboxes`, () => {
        const checkboxes = htmlRes.getElementsByName('court-selections[]');
        expect(checkboxes.length).equal(checkboxesCount, 'Could not find all row checkboxes');
    });
});
