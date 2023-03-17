import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/view-option';
const headingClass = 'govuk-fieldset__heading';
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';

const expectedHeader = 'What do you want to do?';
const expectedButtonText = 'Continue';
const expectedRadioLabel1 = 'Find a court or tribunal';
const expectedRadioLabel2 = 'Find a Single Justice Procedure case';
const expectedRadioHint1 = 'View time, location, type of hearings and more';
const expectedRadioHint2 = 'TV licensing, minor traffic offences such as speeding and more';

let htmlRes: Document;

describe('View Option Page', () => {
    describe('without errors', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(response => {
                    htmlRes = new DOMParser().parseFromString(response.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(expectedHeader, 'Page title does not match header');
        });

        it('should display page header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
        });

        it('should display continue button', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
        });

        it('should display 2 radio buttons', () => {
            const radioButtons = htmlRes.getElementsByClassName(radioClass);
            expect(radioButtons.length).equal(2, '2 radio buttons not found');
        });

        it('should display the beta header', () => {
            window.location.assign('http://localhost:8080/view-option');
            const betaHeader = htmlRes.getElementsByClassName('govuk-phase-banner');
            expect(betaHeader[1].innerHTML).contains('beta', 'Could not locate beta heading.');
            expect(betaHeader[1].innerHTML).contains(
                'https://www.smartsurvey.co.uk/s/FBSPI22/?pageurl',
                'link is broken in the beta heading.'
            );
            expect(betaHeader[1].innerHTML).contains('Cymraeg', 'Welsh toggle is not working!');
        });

        it('should display radio buttons with valid text', () => {
            const radioButtons = htmlRes.getElementsByClassName(radioClass);
            expect(radioButtons[0].innerHTML).contains(
                expectedRadioLabel1,
                'Could not find the radio button with label ' + expectedRadioLabel1
            );
            expect(radioButtons[1].innerHTML).contains(
                expectedRadioLabel2,
                'Could not find the radio button with label ' + expectedRadioLabel2
            );
        });

        it('should display radio buttons with valid hint', () => {
            const radioButtons = htmlRes.getElementsByClassName(radioClass);
            expect(radioButtons[0].innerHTML).contains(
                expectedRadioHint1,
                'Could not find the radio button with hint ' + expectedRadioHint1
            );
            expect(radioButtons[1].innerHTML).contains(
                expectedRadioHint2,
                'Could not find the radio button with hint ' + expectedRadioHint2
            );
        });
    });

    describe('with error', () => {
        beforeAll(async () => {
            await request(app)
                .post(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display an error title', () => {
            const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary__title');
            expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find error title');
        });

        it('should display an error message', () => {
            const errorMessage = htmlRes.getElementsByClassName('govuk-error-summary__list')[0];
            expect(errorMessage.innerHTML).contains('An option must be selected', 'Could not find error message');
        });
    });
});
