import { app, appSetup } from '../../../main/app';
import { expect } from 'chai';
import request from 'supertest';

const PAGE_URL = '/view-option';
let htmlRes;
const NON_SIGNED_IN_LINKS = {
    'Court and tribunal hearings': '/',
    'Sign in': 'sign-in',
};
const SIGNED_IN_LINKS = {
    'Court and tribunal hearings': '/',
    Dashboard: 'account-home',
    'Email subscriptions': 'subscription-management',
    'Sign out': 'logout',
};

describe('Navigation banner tests on the view-option page', () => {
    describe('Non signed in user', () => {
        beforeAll(async () => {
            await appSetup();
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display navigation banner with 2 links', () => {
            const navigationLinks = htmlRes.getElementsByClassName('govuk-service-navigation__link');
            expect(navigationLinks.length).to.equal(2);
        });

        it('links should have correct names and paths', () => {
            const linkKeys = Object.keys(NON_SIGNED_IN_LINKS);
            linkKeys.forEach((value, index) => {
                const link = htmlRes.getElementsByClassName('govuk-service-navigation__link')[index];
                expect(link.innerHTML).contain(value, 'link has incorrect name');
                expect(link.getAttribute('HREF')).contain(NON_SIGNED_IN_LINKS[value], 'link has incorrect path');
            });
        });
    });

    describe('Signed in user', () => {
        beforeAll(async () => {
            await appSetup();
            app.response['locals'] = { user: { roles: 'VERIFIED' } };
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display navigation banner with 4 links', () => {
            const navigationLinks = htmlRes.getElementsByClassName('govuk-service-navigation__link');
            expect(navigationLinks.length).to.equal(4);
        });

        it('links should have correct names and paths', () => {
            const signedInKeys = Object.keys(SIGNED_IN_LINKS);
            signedInKeys.forEach((value, index) => {
                const link = htmlRes.getElementsByClassName('govuk-service-navigation__link')[index];
                expect(link.innerHTML).contain(value, 'link has incorrect name');
                expect(link.getAttribute('HREF')).contain(SIGNED_IN_LINKS[value], 'link has incorrect path');
            });
        });
    });
});
