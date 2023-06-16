import { app } from '../../../main/app';
import { expect } from 'chai';
import { PendingSubscriptionsFromCache } from '../../../main/resources/requests/utils/pendingSubscriptionsFromCache';
import request from 'supertest';
import sinon from 'sinon';

const mockCase = {
    hearingId: 1,
    locationId: 50,
    courtNumber: 1,
    date: '15/11/2021 10:00:00',
    judge: 'Case Judge 1234',
    platform: 'In person',
    caseNumber: 'CASENUM1234',
    caseName: 'Case Name 1234',
    caseUrn: 'CASEURN1234',
    partyNames: 'PARTYNAME1,\nPARTYNAME2',
};

const mockUrnCase = {
    hearingId: 1,
    locationId: 50,
    courtNumber: 1,
    date: '04/01/2020',
    judge: 'Judge for URN case',
    platform: 'In person',
    caseNumber: '11111111',
    caseName: 'CASENAME1234',
    caseUrn: 'A11112222',
    partyNames: 'PARTYNAME3',
    urnSearch: true,
};

const mockCourt = {
    locationId: 643,
    name: 'Aberdeen Tribunal Hearing Centre',
    jurisdiction: 'Tribunal',
    location: 'Scotland',
    hearingList: [],
    hearings: 0,
};
const PAGE_URL = '/pending-subscriptions';
const backLinkClass = 'govuk-back-link';
const tableHeaderClass = 'govuk-table__header';
const pageHeader = 'Confirm your email subscriptions';
let htmlRes: Document;

const getSubscriptionsStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
getSubscriptionsStub.withArgs('1', 'cases').resolves([mockCase, mockUrnCase]);
getSubscriptionsStub.withArgs('1', 'courts').resolves([mockCourt]);
getSubscriptionsStub.withArgs('2', 'cases').resolves([]);
getSubscriptionsStub.withArgs('2', 'courts').resolves([]);
getSubscriptionsStub.withArgs('3', 'cases').resolves([mockCase, mockUrnCase]);
getSubscriptionsStub.withArgs('3', 'courts').resolves([]);
getSubscriptionsStub.withArgs('4', 'cases').resolves([]);
getSubscriptionsStub.withArgs('4', 'courts').resolves([mockCourt]);

describe('Pending Subscriptions Page', () => {
    describe('user with subscriptions', () => {
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
            expect(title[0].innerHTML).contains(pageHeader);
        });

        it('should display correct case table headers', () => {
            const tableHeaders = htmlRes.getElementsByClassName(tableHeaderClass);
            expect(tableHeaders[0].innerHTML).contains('Case name', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Party name(s)', 'Could not find text in second header');
            expect(tableHeaders[2].innerHTML).contains('Reference number', 'Could not find text in third header');
            expect(tableHeaders[3].innerHTML).contains('Actions', 'Could not find text in fourth header');
        });

        it('should display correct court table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[1]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('Court or tribunal name', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Actions', 'Could not find text in second header');
        });

        it('should contain 2 rows in the case table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');

            expect(rows.length).equal(2, 'Case table did not contain expected number of rows');
        });

        it('should contain the correct data for the case number row', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');

            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(cells[0].innerHTML).contains(mockCase.caseName, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('PARTYNAME1', 'Second cell does not contain correct value');
            expect(cells[1].innerHTML).contains('PARTYNAME2', 'Second cell does not contain correct value');
            expect(cells[2].innerHTML).contains(mockCase.caseNumber, 'Third cell does not contain correct value');
            expect(cells[3].innerHTML).contains('Remove', 'Fourth cell does not contain correct value');
            expect(cells[3].querySelector('a').getAttribute('href')).equal(
                `/remove-subscription?case-number=${mockCase.caseNumber}`
            );
        });

        it('should contain the correct data for the urn row', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');

            const cells = rows[1].getElementsByClassName('govuk-table__cell');
            expect(cells[0].innerHTML).contains(mockUrnCase.caseName, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains(mockUrnCase.partyNames, 'Second cell does not contain correct value');
            expect(cells[2].innerHTML).contains(mockUrnCase.caseUrn, 'Third cell does not contain correct value');
            expect(cells[3].innerHTML).contains('Remove', 'Fourth cell does not contain correct value');
            expect(cells[3].querySelector('a').getAttribute('href')).equal(
                `/remove-subscription?case-urn=${mockUrnCase.caseUrn}`
            );
        });

        it('should contain 1 row in the court table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[1]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(1, 'Case table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains(mockCourt.name, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Remove', 'Fourth cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(
                `/remove-subscription?court=${mockCourt.locationId}`
            );
        });

        it('should contain confirm subscriptions button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains('Confirm Subscriptions', 'Could not find submit button');
        });

        it('should display add another email subscription link', () => {
            const addAnotherLink = htmlRes.getElementsByTagName('a')[14];
            expect(addAnotherLink.innerHTML).contains(
                'Add another email Subscription',
                'Could not find add another email subscription link'
            );

            expect(addAnotherLink.getAttribute('href')).equal(
                '/subscription-add',
                'Add another link does not contain href'
            );
        });
    });

    describe('user with court subscription but without case subscriptions', () => {
        beforeAll(async () => {
            app.request['user'] = { userId: '4', roles: 'VERIFIED' };
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
            expect(title[0].innerHTML).contains(pageHeader);
        });

        it('should display correct court table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[0]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('Court or tribunal name', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Actions', 'Could not find text in second header');
        });

        it('should contain 1 row in the court table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(1, 'Case table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains(mockCourt.name, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Remove', 'Fourth cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(
                `/remove-subscription?court=${mockCourt.locationId}`
            );
        });

        it('should contain confirm subscriptions button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains('Confirm Subscriptions', 'Could not find submit button');
        });

        it('should display add another email subscription link', () => {
            const addAnotherLink = htmlRes.getElementsByTagName('a')[12];
            expect(addAnotherLink.innerHTML).contains(
                'Add another email Subscription',
                'Could not find add another email subscription link'
            );

            expect(addAnotherLink.getAttribute('href')).equal(
                '/subscription-add',
                'Add another link does not contain href'
            );
        });
    });

    describe('user with case subscription but without court subscriptions', () => {
        beforeAll(async () => {
            app.request['user'] = { userId: '3', roles: 'VERIFIED' };
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
            expect(title[0].innerHTML).contains(pageHeader);
        });

        it('should display correct case table headers', () => {
            const tableHeaders = htmlRes.getElementsByClassName(tableHeaderClass);
            expect(tableHeaders[0].innerHTML).contains('Case name', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Party name(s)', 'Could not find text in second header');
            expect(tableHeaders[2].innerHTML).contains('Reference number', 'Could not find text in Third header');
            expect(tableHeaders[3].innerHTML).contains('Actions', 'Could not find text in fourth header');
        });

        it('should not display court table headers', () => {
            const tableHeaders = htmlRes.getElementsByClassName('govuk-table')[1];
            expect(tableHeaders).equal(undefined, 'Could not find text in first header');
        });

        it('should contain 2 rows in the case table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');
            expect(rows.length).equal(2, 'Case table did not contain expected number of rows');
        });

        it('should contain the correct data for the case number row', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');

            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(cells[0].innerHTML).contains(mockCase.caseName, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('PARTYNAME1', 'Second cell does not contain correct value');
            expect(cells[1].innerHTML).contains('PARTYNAME2', 'Second cell does not contain correct value');
            expect(cells[2].innerHTML).contains(mockCase.caseNumber, 'Third cell does not contain correct value');
            expect(cells[3].innerHTML).contains('Remove', 'Fourth cell does not contain correct value');
            expect(cells[3].querySelector('a').getAttribute('href')).equal(
                `/remove-subscription?case-number=${mockCase.caseNumber}`
            );
        });

        it('should contain the correct data for the urn row', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');

            const cells = rows[1].getElementsByClassName('govuk-table__cell');
            expect(cells[0].innerHTML).contains(mockUrnCase.caseName, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains(mockUrnCase.partyNames, 'Second cell does not contain correct value');
            expect(cells[2].innerHTML).contains(mockUrnCase.caseUrn, 'Third cell does not contain correct value');
            expect(cells[3].innerHTML).contains('Remove', 'Fourth cell does not contain correct value');
            expect(cells[3].querySelector('a').getAttribute('href')).equal(
                `/remove-subscription?case-urn=${mockUrnCase.caseUrn}`
            );
        });

        it('should not contain any row in the court table', () => {
            const rows = htmlRes.getElementsByClassName('govuk-table__body')[1];
            expect(rows).equal(undefined, 'Case table did not contain expected number of rows');
        });

        it('should contain confirm subscriptions button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains('Confirm Subscriptions', 'Could not find submit button');
        });

        it('should display add another email subscription link', () => {
            const addAnotherLink = htmlRes.getElementsByTagName('a')[13];
            expect(addAnotherLink.innerHTML).contains(
                'Add another email Subscription',
                'Could not find add another email subscription link'
            );

            expect(addAnotherLink.getAttribute('href')).equal(
                '/subscription-add',
                'Add another link does not contain href'
            );
        });
    });

    describe('user without subscriptions', () => {
        beforeAll(async () => {
            app.request['user'] = { userId: '2', roles: 'VERIFIED' };
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByClassName('govuk-cookie-banner cookie-banner')[0].remove();
                });
        });

        it('should display add subscriptions button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains('Add Subscriptions');
        });

        it('should not display add another link', () => {
            const addAnotherLink = htmlRes.getElementsByClassName('govuk-!-text-align-centre');
            expect(addAnotherLink.length).equal(0);
        });

        it('should display error summary if user tries to confirm 0 subscriptions', () => {
            const errorSummaryList = htmlRes.getElementsByClassName('govuk-error-summary__list')[0];
            const errorSummaryTitle = htmlRes.getElementsByClassName('govuk-error-summary__title')[0];
            expect(errorSummaryList.innerHTML).contains('At least 1 subscription is needed.');
            expect(errorSummaryTitle.innerHTML).contains('There is a problem');
        });
    });

    describe('user without subscriptions error screen', () => {
        beforeAll(async () => {
            app.request['user'] = { userId: '2', roles: 'VERIFIED' };
            await request(app)
                .get(`${PAGE_URL}?no-subscriptions=true`)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error summary if user tries to confirm 0 subscriptions', () => {
            const errorSummaryList = htmlRes.getElementsByClassName('govuk-error-summary__list')[0];
            const errorSummaryTitle = htmlRes.getElementsByClassName('govuk-error-summary__title')[0];
            expect(errorSummaryList.innerHTML).contains('At least 1 subscription is needed.');
            expect(errorSummaryTitle.innerHTML).contains('There is a problem');
        });

        it('should display add subscriptions button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains('Add Subscriptions');
        });

        it('should not display add another link', () => {
            const addAnotherLink = htmlRes.getElementsByClassName('govuk-!-text-align-centre');
            expect(addAnotherLink.length).equal(0);
        });
    });
});
