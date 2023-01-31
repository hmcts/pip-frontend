import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import request from 'supertest';

const PAGE_URL = '/account-home';
const pageHeader = 'Your account';
const expectedCards = 3;
const cards = [
    {
        title: 'Court and tribunal hearings',
        description: 'View time, location, type of hearings and more.',
        link: 'search',
    },
    {
        title: 'Single Justice Procedure cases',
        description:
            'Cases ready to be decided by a magistrate without a hearing. Includes TV licensing, minor traffic offences such as speeding and more.',
        link: 'summary-of-publications?locationId=9',
    },
    {
        title: 'Email subscriptions',
        description: 'Get emails about hearings from different courts and tribunals and manage your subscriptions.',
        link: 'subscription-management',
    },
];
let htmlRes: Document;

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Your Account page', () => {
    describe('Without verified param', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(pageHeader, 'Page title does not match header');
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains(pageHeader, 'Could not find correct value in header');
        });

        it('should display 4 card options', () => {
            const cards = htmlRes.getElementsByClassName('account-card');
            expect(cards.length).equal(expectedCards);
        });

        it('cards should have correct content and links', () => {
            for (let i = 0; i < expectedCards; i++) {
                const accountCards = htmlRes.getElementsByClassName('account-card');
                const link = accountCards[i].getElementsByTagName('a')[0];
                const description = accountCards[i].getElementsByTagName('p')[1];
                expect(link.innerHTML).contains(cards[i].title);
                expect(link.getAttribute('href')).contains(cards[i].link);
                expect(description.innerHTML).contains(cards[i].description);
            }
        });
    });

    describe('With verified param', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL + '/?verified=true')
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display the verified banner', () => {
            const banner = htmlRes.getElementsByClassName('govuk-notification-banner');
            expect(banner).to.exist;
        });

        it('should display the header inside the verified banner', () => {
            const bannerHeader = htmlRes.getElementsByClassName('govuk-notification-banner__title')[0];
            expect(bannerHeader.innerHTML).contains('Important');
        });

        it('should display the content inside the verified banner', () => {
            const bannerContent = htmlRes.getElementsByClassName('govuk-notification-banner__heading')[0];
            expect(bannerContent.innerHTML).equals('Your account has been verified.');
        });
    });
});
