import { app } from '../../../main/app';
import { expect } from 'chai';
import { PendingSubscriptionsFromCache } from '../../../main/service/PendingSubscriptionsFromCache';
import { SubscriptionService } from '../../../main/service/SubscriptionService';
import request from 'supertest';
import sinon from 'sinon';

const mockListTypeValue = 'listType1';
const mockListTypeText = 'List Type1';

const mockListLanguageText = 'English';
const mockListLanguage = 'ENGLISH';

const PAGE_URL = '/subscription-configure-list-preview';
const backLinkClass = 'govuk-back-link';
const tableHeaderClass = 'govuk-table__header';
const pageHeader = 'Confirm your email subscriptions';
const pageHeaderWithCourtSub = 'Confirm your email subscriptions';
const btnConfirmSubscription = 'Confirm Subscriptions';
let htmlRes: Document;

const getSubscriptionsStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
const friendlyNameStub = sinon.stub(SubscriptionService.prototype, 'findListTypeFriendlyName');
getSubscriptionsStub.withArgs('1', 'cases').resolves([]);
getSubscriptionsStub.withArgs('1', 'courts').resolves([]);
getSubscriptionsStub.withArgs('1', 'listTypes').resolves([mockListTypeValue]);
getSubscriptionsStub.withArgs('1', 'listLanguage').resolves([mockListLanguage]);
friendlyNameStub.withArgs(mockListTypeValue).resolves(mockListTypeText);

getSubscriptionsStub.withArgs('2', 'cases').resolves([]);
getSubscriptionsStub.withArgs('2', 'courts').resolves([]);
getSubscriptionsStub.withArgs('2', 'listTypes').resolves([]);
getSubscriptionsStub.withArgs('2', 'listLanguage').resolves([mockListLanguage]);

describe('Subscriptions Configure List Preview Page', () => {
    describe('user with list type subscriptions', () => {
        beforeAll(async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            app.response['locals'] = { user: app.request['user'] };

            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(pageHeader, 'Page title does not match header');
        });

        it('should display back button', () => {
            const backButton = htmlRes.getElementsByClassName(backLinkClass);
            expect(backButton[0].innerHTML).contains('Back');
        });

        it('should display title', () => {
            const title = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(title[0].innerHTML).contains(pageHeaderWithCourtSub);
        });

        it('should display correct case table headers', () => {
            const tableHeaders = htmlRes.getElementsByClassName(tableHeaderClass);
            expect(tableHeaders[0].innerHTML).contains('List type', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Actions', 'Could not find text in fourth header');
        });

        it('should display correct court table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[1]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('Version', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Actions', 'Could not find text in second header');
        });

        it('should contain 2 rows in the case table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');

            expect(rows.length).equal(1, 'Case table did not contain expected number of rows');
        });

        it('should contain the correct data for the case number row', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');

            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(cells[0].innerHTML).contains(mockListTypeText, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Remove', 'Fourth cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(
                `/remove-configure-list?list-type=${mockListTypeValue}`
            );
        });

        it('should contain 1 row in the court table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[1]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(1, 'Case table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains(mockListLanguageText, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Change', 'Second cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).contains(`/subscription-configure-list-language`);
        });

        it('should contain confirm subscriptions button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains(btnConfirmSubscription, 'Could not find submit button');
        });
    });

    describe('user without list type subscriptions error screen', () => {
        beforeAll(async () => {
            app.request['user'] = { userId: '2', roles: 'VERIFIED' };
            await request(app)
                .get(`${PAGE_URL}?no-list-configure=true`)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error summary if user tries to confirm 0 list type subscriptions', () => {
            const errorSummaryList = htmlRes.getElementsByClassName('govuk-error-summary__list')[0];
            const errorSummaryTitle = htmlRes.getElementsByClassName('govuk-error-summary__title')[0];
            expect(errorSummaryList.innerHTML).contains('Please select a list type to continue');
            expect(errorSummaryTitle.innerHTML).contains('There is a problem');
        });

        it('should display add subscriptions button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains('Confirm Subscriptions');
        });

        it('should not display add another link', () => {
            const addAnotherLink = htmlRes.getElementsByClassName('govuk-!-text-align-centre');
            expect(addAnotherLink.length).equal(0);
        });
    });
});
