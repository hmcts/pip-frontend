import { app } from '../../../../main/app';
import request from 'supertest';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/system-admin-dashboard';

const pageTitleValue = 'System Admin dashboard';

let htmlRes: Document;

describe('System Admin Dashboard page', () => {
    beforeAll(async () => {
        expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains('System Admin Dashboard', 'Could not find correct value in header');
    });

    it('should display 4 links in banner', () => {
        const bannerComponents = htmlRes.getElementsByClassName('govuk-service-navigation__link');
        expect(bannerComponents.length).equal(4);

        expect(bannerComponents[0].innerHTML).contains('Court and tribunal hearings');
        expect(bannerComponents[1].innerHTML).contains('Dashboard');
        expect(bannerComponents[2].innerHTML).contains('Admin Dashboard');
        expect(bannerComponents[3].innerHTML).contains('Sign out');
    });

    it('should display 7 card options', () => {
        const cardComponents = htmlRes.getElementsByClassName('account-card');
        expect(cardComponents.length).equal(7);
    });

    it('blob Explorer card should have correct content and links', () => {
        const cards = htmlRes.getElementsByClassName('account-card');
        const link = cards[4].getElementsByTagName('a')[0];
        const description = cards[4].getElementsByTagName('p')[1];
        expect(link.innerHTML).contains('Blob Explorer');
        expect(link.getAttribute('href')).contains('blob-view-locations');
        expect(description.innerHTML).contains('Discover content uploaded to all locations.');
    });
});
