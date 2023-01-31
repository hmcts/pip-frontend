import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/create-admin-account';
const radioLabels = [
    'Internal - Super Administrator - CTSC',
    'Internal - Super Administrator - Local',
    'Internal - Administrator - CTSC',
    'Internal - Administrator - Local',
];
const radioHints = [
    'Upload, Remove, Create new accounts, Assess new media requests',
    'Upload, Remove, Create new account',
    'Upload, Remove, Assess new media request',
    'Upload, Remove',
];
const errors = ['Enter first name', 'Enter last name', 'Enter email address', 'Select a role'];
let htmlRes: Document;

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Create Admin Account Page', () => {
    describe('on GET', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains('Create admin account', 'Could not find the header');
        });

        it('should display first name input field', () => {
            const fullNameLabel = htmlRes.getElementsByClassName('govuk-label')[0];
            const input = htmlRes.getElementById('firstName');
            expect(fullNameLabel.innerHTML).contains('First name', 'Could not find first name label');
            expect(input.getAttribute('name')).equals('firstName', 'Could not find firstName input');
        });

        it('should display last name input field', () => {
            const fullNameLabel = htmlRes.getElementsByClassName('govuk-label')[1];
            const input = htmlRes.getElementById('lastName');
            expect(fullNameLabel.innerHTML).contains('Last name', 'Could not find last name label');
            expect(input.getAttribute('name')).equals('lastName', 'Could not find lastName input');
        });

        it('should display email input', () => {
            const emailLabel = htmlRes.getElementsByClassName('govuk-label')[2];
            const input = htmlRes.getElementById('emailAddress');
            expect(emailLabel.innerHTML).contains('Email address', 'Could not find email label');
            expect(input.getAttribute('name')).equals('emailAddress', 'Could not find emailAddress input');
            expect(input.getAttribute('type')).equals('email', 'Could not correct input type');
        });

        it('should display 4 radio buttons with valid values and hints', () => {
            const radioButtons = htmlRes.getElementsByClassName('govuk-radios__item');
            const radioHeader = htmlRes.getElementsByClassName('govuk-fieldset__legend')[0];

            const radiosCount = radioButtons.length;
            expect(radioHeader.innerHTML).contains('User role', 'Could not find radio header');
            expect(radiosCount).equal(4, '4 radio buttons not found');
            for (let i = 0; i < radiosCount; i++) {
                const radio = htmlRes.getElementsByClassName('govuk-radios__label')[i];
                const radioHint = htmlRes.getElementsByClassName('govuk-radios__hint')[i];
                expect(radio.innerHTML).contains(radioLabels[i], 'Could not find radio with correct label');
                expect(radioHint.innerHTML).contains(radioHints[i], 'Could not find radio with correct label');
            }
        });

        it('should display continue button', () => {
            const buttons = htmlRes.getElementsByClassName('govuk-button');
            expect(buttons[0].innerHTML).contains('Continue', 'Could not find button');
        });
    });

    describe('on POST', () => {
        beforeAll(async () => {
            await request(app)
                .post(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error dialog', () => {
            const dialog = htmlRes.getElementsByClassName('govuk-error-summary');
            expect(dialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML).contains(
                'There is a problem',
                'Could not find error dialog title'
            );
        });

        it('should display error summary messages', () => {
            const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
            for (let i = 0; i < errorMessage.length; i++) {
                expect(errorMessage[i].innerHTML).contains(errors[i], 'Could not find error for an radio');
            }
        });
    });
});
