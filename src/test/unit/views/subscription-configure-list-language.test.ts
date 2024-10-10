import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';

const PAGE_URL = '/subscription-configure-list-language';
const backButtonClass = 'govuk-back-link';
const errorSummaryClass = 'govuk-error-summary';
const errorMessageId = 'subscription-choice-error';
const headingClass = 'govuk-fieldset__heading';
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';
const expectedHeader = 'What version of the list do you want to receive?';
const expectedButtonText = 'Continue';
const expectedRadioLabel1 = 'English';
const expectedRadioLabel2 = 'Welsh';
const expectedRadioLabel3 = 'English and Welsh';

app.request['user'] = { roles: 'VERIFIED' };

let htmlRes: Document;
describe('Subscriptions config list language Page initial load', () => {
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
        expect(pageTitle).contains(expectedHeader, 'Page title does not match header');
    });

    it('should display a back button with the correct value', () => {
        const backLink = htmlRes.getElementsByClassName(backButtonClass);
        expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
        expect(backLink[0].getAttribute('href')).equal(
            '/subscription-configure-list',
            'Back value does not contain correct link'
        );
    });

    it('should not display the error summary on loading', () => {
        const errorSummary = htmlRes.getElementsByClassName(errorSummaryClass);
        expect(errorSummary.length).equals(0, 'Error summary is incorrectly displayed');
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should not display the error message on loading', () => {
        const errorMessage = htmlRes.getElementById(errorMessageId);
        expect(errorMessage).not.exist;
    });

    it('should display continue button', () => {
        const buttons = htmlRes.getElementsByClassName(buttonClass);
        expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
    });

    it('should display 3 radio buttons', () => {
        const radioButtons = htmlRes.getElementsByClassName(radioClass);
        expect(radioButtons.length).equal(3, '3 radio buttons not found');
    });

    it('should display first radio button content', () => {
        const radioButtons = htmlRes.getElementsByClassName(radioClass);
        expect(radioButtons[0].innerHTML).contains(
            expectedRadioLabel1,
            'Could not find the radio button with label ' + expectedRadioLabel1
        );
    });

    it('should display second radio button content', () => {
        const radioButtons = htmlRes.getElementsByClassName(radioClass);
        expect(radioButtons[1].innerHTML).contains(
            expectedRadioLabel2,
            'Could not find the radio button with label ' + expectedRadioLabel2
        );
    });

    it('should display third radio button content', () => {
        const radioButtons = htmlRes.getElementsByClassName(radioClass);
        expect(radioButtons[2].innerHTML).contains(
            expectedRadioLabel3,
            'Could not find the radio button with label ' + expectedRadioLabel3
        );
    });
});
