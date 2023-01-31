import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/create-system-admin-account';
const errors = ['Enter first name', 'Enter last name', 'Enter email address'];
let htmlRes: Document;

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Create System Admin Account Page', () => {
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
            expect(header[0].innerHTML).contains('Create system admin account', 'Could not find the header');
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
