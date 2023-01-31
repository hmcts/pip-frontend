import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/sign-in';
const pageTitleValue = 'How do you want to sign in?';
const headingClass = 'govuk-fieldset__heading';
const buttonClass = 'govuk-button';
const errorSummaryClass = 'govuk-error-summary';
const radioClass = 'govuk-radios__item';
const expectedHeader = 'How do you want to sign in?';
const expectedButtonText = 'Continue';
const expectedRadioLabel = [
    'With a MyHMCTS account',
    'With a Common Platform account',
    'With a Court and tribunal hearings account',
];

let htmlRes: Document;

describe('Sign In option Page', () => {
    describe('without error state', () => {
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

        it('should not display error summary', () => {
            const errorSummary = htmlRes.getElementsByClassName(errorSummaryClass);
            expect(errorSummary.length).to.equal(0);
        });

        it('should display continue button', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
        });

        it('should display 3 radio buttons', () => {
            const radioButtons = htmlRes.getElementsByClassName(radioClass);
            expect(radioButtons.length).equal(3, '3 radio buttons not found');
        });

        it('CFT IDAM radio button should be enabled', () => {
            const radioButtons = htmlRes.getElementsByClassName(radioClass)[0];
            expect(radioButtons.innerHTML).not.includes('disabled');
        });

        it('Crime IDAM radio button should be disabled', () => {
            const radioButtons = htmlRes.getElementsByClassName(radioClass)[1];
            expect(radioButtons.innerHTML).includes('disabled');
        });

        it('P&I IDAM radio button should be enabled', () => {
            const radioButtons = htmlRes.getElementsByClassName(radioClass)[2];
            expect(radioButtons.innerHTML).not.includes('disabled');
        });

        it('should display radio button content', () => {
            const radioButtons = htmlRes.getElementsByClassName(radioClass);
            for (let i = 0; i < 3; i++) {
                expect(radioButtons[i].innerHTML).contains(
                    expectedRadioLabel[i],
                    'Could not find the radio button with label ' + expectedRadioLabel[i]
                );
            }
        });

        it('should display hint for Common Platform', () => {
            const message = htmlRes.getElementsByClassName('govuk-radios__hint');
            expect(message[0].innerHTML).contains(
                'You will be able to sign in with a Common Platform account later this year.'
            );
        });

        it('should display request account message', () => {
            const message = htmlRes.getElementsByClassName('govuk-body-s');
            expect(message[0].innerHTML).contains("Don't have an account?", 'Could not find request account message');
        });

        it('should display request account link', () => {
            const requestAccLink = htmlRes.getElementsByClassName('govuk-link');
            expect(requestAccLink[2].innerHTML).contains(
                'Create a Court and tribunal hearings account',
                'Could not find request account link'
            );
            expect(requestAccLink[2].getAttribute('href')).contains(
                'create-media-account',
                'Link does not contain correct url'
            );
        });
    });

    describe('with error state', () => {
        beforeAll(async () => {
            await request(app)
                .get(`${PAGE_URL}?error=true`)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error summary with appropriate message', () => {
            const errorSummary = htmlRes.getElementsByClassName(errorSummaryClass);
            expect(errorSummary[0].getElementsByTagName('h2')[0].innerHTML).contains(
                'There is a problem',
                'Could not find error summary title'
            );
            expect(errorSummary[0].getElementsByTagName('li')[0].innerHTML).contains(
                'Please select an option',
                'Could not find error message'
            );
        });
    });

    describe('with cft disabled', () => {
        beforeAll(async () => {
            process.env.ENABLE_CFT = 'false';
            await request(app)
                .get(`${PAGE_URL}?error=true`)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        afterAll(() => {
            process.env.ENABLE_CFT = 'true';
        });

        it('CFT IDAM radio button should be disabled', () => {
            const radioButtons = htmlRes.getElementsByClassName(radioClass)[0];
            expect(radioButtons.innerHTML).includes('disabled');
        });
    });
});
