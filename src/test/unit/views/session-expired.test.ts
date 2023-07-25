import { expect } from 'chai';

const PAGE_URL = '/session-expired';
import request from 'supertest';
import { app } from '../../../main/app';

const expectedHeader = 'You have been signed out, due to inactivity';
const expectedBodyDetail =
    'This has been for your security and for the security of the individuals included within our service.';
const expectedBodySignInMessage = 'Please click here to sign in or close this session';
const expectedButtonText = 'Sign in';

let htmlRes: Document;

describe('Session Expired Page', () => {
    describe('verified media user', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL + '?reSignInUrl=AAD')
                .then(response => {
                    htmlRes = new DOMParser().parseFromString(response.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(expectedHeader, 'Page title does not match');
        });

        it('should display page header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains(expectedHeader, 'Page header does not match');
        });

        it('should display page body', () => {
            const body = htmlRes.getElementsByClassName('govuk-body');
            expect(body[0].innerHTML).contains(expectedBodyDetail, 'Page body detail does not match');
            expect(body[1].innerHTML).contains(expectedBodySignInMessage, 'Page message does not match');
        });

        it('should display sign in button', () => {
            const buttons = htmlRes.getElementsByClassName('govuk-button');
            expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
            expect(buttons[0].attributes.getNamedItem('href').value).contains(
                '/login?p=B2C_1_SignInUserFlow',
                'Could not find button href'
            );
        });
    });

    describe('admin user', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL + '?reSignInUrl=ADMIN')
                .then(response => {
                    htmlRes = new DOMParser().parseFromString(response.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display sign in button', () => {
            const buttons = htmlRes.getElementsByClassName('govuk-button');
            expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
            expect(buttons[0].attributes.getNamedItem('href').value).contains(
                '/admin-login?p=B2C_1_SignInAdminUserFlow',
                'Could not find button href'
            );
        });
    });

    describe('CFT user', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL + '?reSignInUrl=CFT')
                .then(response => {
                    htmlRes = new DOMParser().parseFromString(response.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display sign in button', () => {
            const buttons = htmlRes.getElementsByClassName('govuk-button');
            expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
            expect(buttons[0].attributes.getNamedItem('href').value).contains(
                '/cft-login',
                'Could not find button href'
            );
        });
    });
});
