import { app } from '../../../main/app';
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

    it('should display 5 links in banner', () => {
        const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
        expect(bannerComponents.length).equal(5);

        expect(bannerComponents[0].innerHTML).equal('Home');
        expect(bannerComponents[1].innerHTML).equal('Admin Dashboard');
        expect(bannerComponents[2].innerHTML).equal('Upload');
        expect(bannerComponents[3].innerHTML).equal('Remove');
        expect(bannerComponents[4].innerHTML).equal('Sign out');
    });

    it('should display 8 card options', () => {
        const cardComponents = htmlRes.getElementsByClassName('account-card');
        expect(cardComponents.length).equal(8);
    });

    it('create system admin account card should have correct content and links', () => {
        const adminCards = htmlRes.getElementsByClassName('account-card');
        const link = adminCards[0].getElementsByTagName('a')[0];
        const description = adminCards[0].getElementsByTagName('p')[1];
        expect(link.innerHTML).contains('Create System Admin');
        expect(link.getAttribute('href')).contains('create-system-admin-account');
        expect(description.innerHTML).contains('Create a new system admin user');
    });

    it('blob Explorer card should have correct content and links', () => {
        const cards = htmlRes.getElementsByClassName('account-card');
        const link = cards[5].getElementsByTagName('a')[0];
        const description = cards[5].getElementsByTagName('p')[1];
        expect(link.innerHTML).contains('Blob Explorer');
        expect(link.getAttribute('href')).contains('blob-view-locations');
        expect(description.innerHTML).contains('Discover content uploaded to all locations.');
    });
});
