import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
const largeHeadingClass = 'govuk-heading-l';

let htmlRes: Document;

describe('password-change-confirmation', () => {
    describe('Admin user', () => {
        beforeAll(async () => {
            const PAGE_URL = '/password-change-confirmation/true';
            await request(app)
                .post(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display the page header', () => {
            const header = htmlRes.getElementsByClassName(largeHeadingClass);
            expect(header[0].innerHTML).contains('Password changed successfully', 'Could not find the header');
        });

        it('should display the body text', () => {
            const bodyText = htmlRes.getElementsByClassName('govuk-body');
            expect(bodyText[4].innerHTML).contains(
                'You can now sign in with your new credentials using the button below.',
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
            const PAGE_URL = '/password-change-confirmation/false';
            await request(app)
                .post(PAGE_URL)
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
