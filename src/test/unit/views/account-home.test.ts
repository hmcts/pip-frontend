import { app } from '../../../main/app';
import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { UserCommunicationService } from '../../../main/service/UserCommunicationService';

const PAGE_URL = '/account-home';
const pageTitle = 'Dashboard - Your account - Court and Tribunal Hearings - GOV.UK';
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

const accountVerifiedMessage = 'Your account has been verified.';
const cftIdamMessage = 'test message for CFT_IDAM user only';
const verifiedRoleMessage = 'test message for verified user only';

sinon.stub(UserCommunicationService.prototype, 'groupCommunicationMessages').resolves({
    userProvenanceType: [
        { message: cftIdamMessage, provenances: ['CFT_IDAM'] },
    ],
    userRoleType: [
        { message: verifiedRoleMessage, roles: ['VERIFIED'] },
    ],
});

let htmlRes: Document;

describe('Your Account page', () => {
    describe('PI_ADD user - Without verified param', () => {
        beforeAll(async () => {
            app.request['user'] = {
                roles: 'VERIFIED',
                userProvenance: 'PI_AAD',
            };

            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should have correct page title', () => {
            expect(pageTitle).contains(htmlRes.title, 'Page title does not match header');
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

        it('should display the verified banner', () => {
            const banner = htmlRes.getElementsByClassName('govuk-notification-banner');
            expect(banner).to.exist;
        });

        it('should display the header inside the verified banner', () => {
            const bannerHeader = htmlRes.getElementsByClassName('govuk-notification-banner__title')[0];
            expect(bannerHeader.innerHTML).contains('Important');
        });

        it('should display the content inside the verified banner', () => {
            const bannerContent = htmlRes.getElementsByClassName('govuk-notification-banner__content')[0];
            expect(bannerContent.innerHTML).contains(verifiedRoleMessage);
            expect(bannerContent.innerHTML).not.contains(accountVerifiedMessage);
            expect(bannerContent.innerHTML).not.contains(cftIdamMessage);
        });
    });

    describe('PI_ADD user - With verified param', () => {
        beforeAll(async () => {
            app.request['user'] = {
                roles: 'VERIFIED',
                userProvenance: 'PI_AAD',
            };
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
            const bannerContent = htmlRes.getElementsByClassName('govuk-notification-banner__content')[0];
            expect(bannerContent.innerHTML).contains(accountVerifiedMessage);
            expect(bannerContent.innerHTML).contains(verifiedRoleMessage);
            expect(bannerContent.innerHTML).not.contains(cftIdamMessage);
        });
    });

    describe('CFT_IDAM user', () => {
        beforeAll(async () => {
            app.request['user'] = {
                roles: 'VERIFIED',
                userProvenance: 'CFT_IDAM',
            };

            await request(app)
                .get(PAGE_URL)
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
            const bannerContent = htmlRes.getElementsByClassName('govuk-notification-banner__content')[0];
            expect(bannerContent.innerHTML).contains(cftIdamMessage);
            expect(bannerContent.innerHTML).contains(verifiedRoleMessage);
            expect(bannerContent.innerHTML).not.contains(accountVerifiedMessage);
        });
    });
});
