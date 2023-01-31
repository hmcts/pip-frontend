import { app } from '../../../main/app';
import { expect } from 'chai';
import { LocationRequests } from '../../../main/resources/requests/locationRequests';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import sinon from 'sinon';
import { request as expressRequest } from 'express';

const PAGE_URL = '/remove-list-search';
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
sinon.stub(LocationRequests.prototype, 'getAllLocations').returns(courtData);
sinon.stub(LocationRequests.prototype, 'getLocationByName').returns(null);

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

let htmlRes: Document;

describe('Remove List Search Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(response => {
                htmlRes = new DOMParser().parseFromString(response.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display the header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains('Find content to remove', 'Could not find the header');
    });

    it('should display continue button', () => {
        const buttons = htmlRes.getElementsByClassName('govuk-button');
        expect(buttons[0].innerHTML).contains('Continue', 'Could not find button');
    });

    it('should use accessible autocomplete in the script block', () => {
        const script = htmlRes.getElementsByTagName('script')[5];
        expect(script.innerHTML).contains('accessibleAutocomplete');
    });

    it('should autocomplete source with court names', () => {
        const script = htmlRes.getElementsByTagName('script')[5];
        expect(script.innerHTML).contains("Abergavenny Magistrates' Court", 'Could not find input field');
    });

    it('should display back button', () => {
        const backButton = htmlRes.getElementsByClassName('govuk-back-link');
        expect(backButton[0].innerHTML).contains('Back', 'Back does not contain correct text');
    });

    it('should not display error summary on the initial load', () => {
        const errorBox = htmlRes.getElementsByClassName('govuk-error-summary');
        expect(errorBox.length).equal(0, 'Error summary should not be displayed');
    });

    it('should not display input with error classes', () => {
        const inputError = htmlRes.getElementsByClassName('govuk-input--error');
        expect(inputError.length).equal(0, 'Input should not have error classes');
    });
});

describe('Remove List Blank Input', () => {
    beforeAll(async () => {
        await request(app)
            .post(PAGE_URL)
            .send({ 'input-autocomplete': '' })
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display minimum input error message', () => {
        const errorSummary = htmlRes.getElementsByClassName('govuk-error-summary__body');
        expect(errorSummary[0].innerHTML).contains(
            'Court or tribunal name must be 3 characters or more',
            'Could not find error message'
        );
    });

    it('should display error message', () => {
        const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary__title');
        expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find title');
    });

    it('should display input errors', () => {
        const formError = htmlRes.getElementsByClassName('govuk-form-group--error');
        expect(formError.length).equal(1, 'Could not find form errors');
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
        const errorSummary = htmlRes.getElementsByClassName('govuk-error-summary__body');
        expect(errorSummary[0].innerHTML).contains('There are no matching results', 'Could not find error message');
    });

    it('should display error message', () => {
        const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary__title');
        expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find error title');
    });

    it('should display input errors', () => {
        const formError = htmlRes.getElementsByClassName('govuk-form-group--error');
        expect(formError.length).equal(1, 'Could not find form errors');
    });
});
