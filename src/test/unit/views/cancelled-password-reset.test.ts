import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
const largeHeadingClass = 'govuk-heading-l';

let htmlRes: Document;

describe('Cancelled Password Reset', () => {
    describe('Admin user', () => {
        beforeAll(async () => {
            const PAGE_URL = '/cancelled-password-reset/true';
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display the page header', () => {
            const header = htmlRes.getElementsByClassName(largeHeadingClass);
            expect(header[0].innerHTML).contains('Password unchanged', 'Could not find the header');
        });

        it('should display the body text', () => {
            const bodyText = htmlRes.getElementsByClassName('govuk-body');
            expect(bodyText[4].innerHTML).contains(
                'Your credentials have not been changed. You can still sign-in using the button below and your existing credentials.',
                'Could not find body text'
            );
        });

        it('should display the button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button');
            expect(button[4].textContent).contains('Sign in', 'Could not find button');
            expect(button[4].outerHTML).contains('B2C_1_SignInAdminUserFlow');
        });
    });

    describe('Media user', () => {
        beforeAll(async () => {
            const PAGE_URL = '/cancelled-password-reset/false';
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display the button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button');
            expect(button[4].textContent).contains('Sign in', 'Could not find button');
            expect(button[4].outerHTML).contains('B2C_1_SignInUserFlow');
        });
    });
});
