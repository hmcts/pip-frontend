import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { PublicationRequests } from '../../../main/resources/requests/publicationRequests';

const PAGE_URL = '/party-name-search';
let htmlRes: Document;

sinon.stub(PublicationRequests.prototype, 'getPublicationByCaseValue').returns([]);

app.request['user'] = { roles: 'VERIFIED' };

describe('Party name search page', () => {
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
        expect(pageTitle).contains('Subscribe by party name', 'Page title does not match');
    });

    it('should display header', () => {
        const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(pageHeading[0].innerHTML).contains(
            'What is the surname or organisation name of the party involved in the case?',
            'Page heading does not match'
        );
    });

    it('should display continue button', () => {
        const buttons = htmlRes.getElementsByClassName('govuk-button');
        expect(buttons[0].innerHTML).contains('Continue', 'Could not find button');
    });

    it('should display blank input filed', () => {
        const inputField = htmlRes.getElementsByTagName('input');
        expect(inputField[0].value).equal('', 'Input should be blank');
    });

    it('should display appropriate label for input field', () => {
        const inputLabel = htmlRes.getElementsByTagName('label');
        expect(inputLabel[0].innerHTML).contains('For example, Smith.');
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

describe('Party name search page with no matching results', () => {
    beforeAll(async () => {
        await request(app)
            .post(PAGE_URL)
            .send({ 'party-name': 'invalid name' })
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display error summary', () => {
        const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary');
        expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find error summary');
    });

    it('should display error summary body', () => {
        const errorBody = htmlRes.getElementsByClassName('govuk-error-summary__body');
        expect(errorBody[0].innerHTML).contains(
            'There is nothing matching your criteria',
            'Could not find error summary'
        );
    });

    it('should display additional messages', () => {
        const additionalMessage = htmlRes.getElementsByClassName('govuk-heading-s');
        const improveResultsMessage = htmlRes.getElementsByClassName('govuk-body');
        expect(additionalMessage[0].innerHTML).contains(
            'There are no matching results.',
            'Could not find additional message'
        );
        expect(improveResultsMessage[0].innerHTML).contains('You can:', 'Could not find improve results message');
    });

    it('should display input with error classes', () => {
        const inputError = htmlRes.getElementsByClassName('govuk-input--error');
        expect(inputError.length).equal(1, 'Input should have error classes');
    });

    it('should display input error message', () => {
        const inputError = htmlRes.getElementById('party-name-error');
        expect(inputError.innerHTML).contains('Please provide a correct party name', 'Input should have error classes');
    });
});

describe('Party name search page with search of less than 3 characters', () => {
    beforeAll(async () => {
        await request(app)
            .post(PAGE_URL)
            .send({ 'party-name': 'aa' })
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display error summary', () => {
        const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary');
        expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find error summary');
    });

    it('should display error summary body', () => {
        const errorBody = htmlRes.getElementsByClassName('govuk-error-summary__body');
        expect(errorBody[0].innerHTML).contains(
            'Please enter a minimum of 3 characters',
            'Could not find error summary'
        );
    });

    it('should display input with error classes', () => {
        const inputError = htmlRes.getElementsByClassName('govuk-input--error');
        expect(inputError.length).equal(1, 'Input should have error classes');
    });

    it('should display input error message', () => {
        const inputError = htmlRes.getElementById('party-name-error');
        expect(inputError.innerHTML).contains(
            'Please enter a minimum of 3 characters',
            'Input should have error classes'
        );
    });
});
