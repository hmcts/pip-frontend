import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';

const PAGE_URL = '/case-reference-number-search';
const headingClass = 'govuk-heading-l';
const buttonClass = 'govuk-button';
const errorSummaryClass = 'govuk-error-summary';
const inputErrorClass = 'govuk-input--error';
const errorSummaryTitleClass = 'govuk-error-summary__title';
const errorSummaryBodyClass = 'govuk-error-summary__body';
const formErrorClass = 'govuk-form-group--error';

const expectedHeader = 'What is the reference number?';
const expectedButtonText = 'Continue';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData)[0].search.cases[0];
const stub = sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber');
stub.resolves(subscriptionsData);

app.request['user'] = { roles: 'VERIFIED' };

const pageTitleValue = 'Subscribe by case reference number, case ID or URN';

describe('Case Reference Search Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should display continue button', () => {
        const buttons = htmlRes.getElementsByClassName(buttonClass);
        expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
    });

    it('should display back button', () => {
        const backButton = htmlRes.getElementsByClassName('govuk-back-link');
        expect(backButton[0].innerHTML).contains('Back', 'Back button does not contain correct text');
        expect(backButton[0].getAttribute('href')).equal('#', 'Back button does not contain correct link');
    });

    it('should not display error summary on the initial load', () => {
        const errorBox = htmlRes.getElementsByClassName(errorSummaryClass);
        expect(errorBox.length).equal(0, 'Error summary should not be displayed');
    });

    it('should not display input with error classes', () => {
        const inputError = htmlRes.getElementsByClassName(inputErrorClass);
        expect(inputError.length).equal(0, 'Input should not have error classes');
    });
});

describe('Case Reference Search Page Blank Input', () => {
    beforeAll(async () => {
        await request(app)
            .post(PAGE_URL)
            .send({ 'search-input': '' })
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
        expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find title');
    });

    it('should display input errors', () => {
        const formError = htmlRes.getElementsByClassName(formErrorClass);
        expect(formError.length).equal(1, 'Could not find form errors');
    });
});

describe('Case Reference Search Page Invalid Input', () => {
    beforeAll(async () => {
        stub.resolves(null);
        await request(app)
            .post(PAGE_URL)
            .send({ 'search-input': '12345' })
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

    it('should display error message when search invalid case reference no', () => {
        const errorTitle = htmlRes.getElementsByClassName(errorSummaryTitleClass);
        expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find error title');
    });

    it('should display input errors', () => {
        const formError = htmlRes.getElementsByClassName(formErrorClass);
        expect(formError.length).equal(1, 'Could not find form errors');
    });
});
