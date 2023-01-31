import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { LocationRequests } from '../../../main/resources/requests/locationRequests';

const PAGE_URL = '/search';
const headingClass = 'govuk-label-wrapper';
const buttonClass = 'govuk-button';
const errorSummaryClass = 'govuk-error-summary';
const inputErrorClass = 'govuk-input--error';
const errorSummaryTitleClass = 'govuk-error-summary__title';
const errorSummaryBodyClass = 'govuk-error-summary__body';
const formErrorClass = 'govuk-form-group--error';
const additionalMessageClass = 'govuk-heading-s';
const expectedHeader = 'What court or tribunal are you interested in?';
const expectedButtonText = 'Continue';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);

sinon.stub(LocationRequests.prototype, 'getAllLocations').returns(courtData);
sinon.stub(LocationRequests.prototype, 'getLocationByName').returns(null);

describe('Search Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(expectedHeader, 'Page title does not match');
    });

    it('should display continue button', () => {
        const buttons = htmlRes.getElementsByClassName(buttonClass);
        expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
    });

    it('should use accessible autocomplete in script', () => {
        const script = htmlRes.getElementsByTagName('script')[5];
        expect(script.innerHTML).contains('accessibleAutocomplete');
    });

    it('should fill source with court names', () => {
        const script = htmlRes.getElementsByTagName('script')[5];
        expect(script.innerHTML).contains("Abergavenny Magistrates' Court", 'Could not find input field');
    });

    it('should display back button', () => {
        const backButton = htmlRes.getElementsByClassName('govuk-back-link')[0];
        expect(backButton.innerHTML).contains('Back', 'Back button does not contain correct text');
    });

    it('should not display error summary on the initial load', () => {
        const errorBox = htmlRes.getElementsByClassName(errorSummaryClass);
        expect(errorBox.length).equal(0, 'Error summary should not be displayed');
    });

    it('should not display input with error classes', () => {
        const inputError = htmlRes.getElementsByClassName(inputErrorClass);
        expect(inputError.length).equal(0, 'Input should not have error classes');
    });

    it('should display a h2 element for the Want to see all courts and tribunals section', () => {
        const h2Element = htmlRes.getElementsByTagName('h2');
        expect(h2Element[0].innerHTML).contains(
            'Want to see all courts and tribunals?',
            'Could not find the h2 element'
        );
    });
});

describe('Search Page Invalid Input', () => {
    beforeAll(async () => {
        await request(app)
            .post(PAGE_URL)
            .send({ 'input-autocomplete': 'foo' })
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display minimum input error message', () => {
        const errorSummary = htmlRes.getElementsByClassName(errorSummaryBodyClass);
        expect(errorSummary[0].innerHTML).contains(
            'There is nothing matching your criteria',
            'Could not find error message'
        );
    });

    it('should display error message', () => {
        const errorTitle = htmlRes.getElementsByClassName(errorSummaryTitleClass);
        expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find error title');
    });

    it('should display input errors', () => {
        const formError = htmlRes.getElementsByClassName(formErrorClass);
        expect(formError.length).equal(1, 'Could not find form errors');
    });

    it('should display additional message', () => {
        const additionalMessage = htmlRes.getElementsByClassName(additionalMessageClass);
        expect(additionalMessage[0].innerHTML).contains(
            'There are no matching results.',
            'Could not find additional message'
        );
    });
});
