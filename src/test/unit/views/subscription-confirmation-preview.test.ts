import { app } from '../../../main/app';
import { expect } from 'chai';
import { PendingSubscriptionsFromCache } from '../../../main/service/PendingSubscriptionsFromCache';
import request from 'supertest';
import sinon from 'sinon';
import { SubscriptionService } from '../../../main/service/SubscriptionService';

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
    caseName: 'CaseName1234',
    caseUrn: 'A11112222',
    partyNames: 'PARTYNAME3',
    urnSearch: true,
};

const mockCourt = {
    locationId: 1,
    name: 'Aberdeen Tribunal Hearing Centre',
    welshName: 'Canolfan Gwrandawiadau Tribiwnlys Aberdeen',
};

const mockCourt2 = {
    locationId: 2,
    name: 'Basildon Combined Court',
    welshName: 'Llysoedd Cyfun Basildon',
};

const mockCourt3 = {
    locationId: 3,
    name: 'Cambridge County Court and Family Court',
    welshName: 'Llys Sirol a Llys Teulu Caergrawnt',
};

const mockListTypeValue = 'listType1';
const mockListTypeText = 'List Type1';
const mockWelshListTypeText = 'Welsh List Type1';

const mockListLanguageText = 'English';
const mockListLanguage = 'ENGLISH';

const PAGE_URL = '/subscription-confirmation-preview';
const backLinkClass = 'govuk-back-link';
const tableHeaderClass = 'govuk-table__header';
const pageHeader = 'Confirm your email subscriptions';
const pageHeaderWithCourtSub = 'Confirm your email subscriptions';
const btnConfirmSubscription = 'Confirm Subscriptions';
let htmlRes: Document;

const getSubscriptionsStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
const friendlyNameStub = sinon.stub(SubscriptionService.prototype, 'findListTypeFriendlyName');

getSubscriptionsStub.withArgs('1', 'cases').resolves([mockCase, mockUrnCase]);
getSubscriptionsStub.withArgs('1', 'courts').resolves([mockCourt]);
getSubscriptionsStub.withArgs('1', 'listTypes').resolves([mockListTypeValue]);
getSubscriptionsStub.withArgs('1', 'listLanguage').resolves([mockListLanguage]);

getSubscriptionsStub.withArgs('2', 'cases').resolves([]);
getSubscriptionsStub.withArgs('2', 'courts').resolves([]);
getSubscriptionsStub.withArgs('2', 'listTypes').resolves([]);
getSubscriptionsStub.withArgs('2', 'listLanguage').resolves([]);

getSubscriptionsStub.withArgs('3', 'cases').resolves([mockCase, mockUrnCase]);
getSubscriptionsStub.withArgs('3', 'courts').resolves([]);
getSubscriptionsStub.withArgs('3', 'listTypes').resolves([]);
getSubscriptionsStub.withArgs('3', 'listLanguage').resolves([]);

getSubscriptionsStub.withArgs('4', 'cases').resolves([]);
getSubscriptionsStub.withArgs('4', 'courts').resolves([mockCourt, mockCourt2, mockCourt3]);
getSubscriptionsStub.withArgs('4', 'listTypes').resolves([mockListTypeValue]);
getSubscriptionsStub.withArgs('4', 'listLanguage').resolves([mockListLanguage]);

getSubscriptionsStub.withArgs('5', 'cases').resolves([]);
getSubscriptionsStub.withArgs('5', 'courts').resolves([mockCourt]);
getSubscriptionsStub.withArgs('5', 'listTypes').resolves([]);
getSubscriptionsStub.withArgs('5', 'listLanguage').resolves([mockListLanguage]);

friendlyNameStub.withArgs(mockListTypeValue, 'en').resolves(mockListTypeText);
friendlyNameStub.withArgs(mockListTypeValue, 'cy').resolves(mockWelshListTypeText);

describe('Subscriptions Confirmation Preview Page', () => {
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
            expect(pageTitle).contains(
                'Confirm your email subscriptions - List types updated - Court and Tribunal Hearings - GOV.UK',
                'Page title does not match header'
            );
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

        it('should display correct list type table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[2]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('List type', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Actions', 'Could not find text in second header');
        });

        it('should display correct list language table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[3]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('Version', 'Could not find text in first header');
            expect(tableHeaders[0].innerHTML).contains(
                'This version change will affect the previously selected language for all existing subscriptions.',
                'Could not find information text in first header'
            );
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
                `/remove-pending-subscription?case-number=${mockCase.caseNumber}`
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
                `/remove-pending-subscription?case-urn=${mockUrnCase.caseUrn}`
            );
        });

        it('should contain 1 row in the court table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[1]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(1, 'Court table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains(mockCourt.name, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Remove', 'Fourth cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(
                `/remove-pending-subscription?court=${mockCourt.locationId}`
            );
        });

        it('should contain 1 row in the list type table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[2]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(1, 'List Type table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains(mockListTypeText, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Remove', 'Fourth cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(
                `/remove-pending-subscription?list-type=${mockListTypeValue}`
            );
        });

        it('should contain 1 row in the list language table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[3]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(1, 'List Language table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains(mockListLanguageText, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Change', 'Fourth cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(`/subscription-add-list-language`);
        });

        it('should contain confirm subscriptions button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains(btnConfirmSubscription, 'Could not find submit button');
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
            expect(title[0].innerHTML).contains(pageHeaderWithCourtSub);
        });

        it('should display correct court table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[0]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('Court or tribunal name', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Actions', 'Could not find text in second header');
        });

        it('should contain 3 rows in the court table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(3, 'Case table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains(mockCourt.name, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Remove', 'Second cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(
                `/remove-pending-subscription?court=${mockCourt.locationId}`
            );
        });

        it('should display correct list type table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[1]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('List type', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Actions', 'Could not find text in second header');
        });

        it('should display correct list language table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[2]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('Version', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Actions', 'Could not find text in second header');
        });

        it('should contain 1 row in the list type table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[1]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(1, 'List Type table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains(mockListTypeText, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Remove', 'Second cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(
                `/remove-pending-subscription?list-type=${mockListTypeValue}`
            );
        });

        it('should contain 1 row in the list language table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[2]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(1, 'List Language table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains(mockListLanguageText, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Change', 'Second cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(`/subscription-add-list-language`);
        });

        it('should contain confirm subscriptions button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains(btnConfirmSubscription, 'Could not find submit button');
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

    describe('user with court subscription but without case subscriptions in Welsh', () => {
        beforeAll(async () => {
            app.request['user'] = { userId: '4', roles: 'VERIFIED' };
            await request(app)
                .get(PAGE_URL + '?lng=cy')
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display correct court table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[0]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains(
                'Enw’r llys neu’r tribiwnlys',
                'Could not find text in first header'
            );
            expect(tableHeaders[1].innerHTML).contains('Camau gweithredu', 'Could not find text in second header');
        });

        it('should contain 3 rows in the court table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');
            expect(rows.length).equal(3, 'Case table did not contain expected number of rows');

            const firstRowCells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(firstRowCells[0].innerHTML).contains(
                mockCourt.welshName,
                'First cell does not contain correct value'
            );
            expect(firstRowCells[1].innerHTML).contains('Dileu', 'Second cell does not contain correct value');
            expect(firstRowCells[1].querySelector('a').getAttribute('href')).equal(
                `/remove-pending-subscription?court=${mockCourt.locationId}`
            );

            const secondRowCells = rows[1].getElementsByClassName('govuk-table__cell');
            expect(secondRowCells[0].innerHTML).contains(
                mockCourt3.welshName,
                'First cell does not contain correct value'
            );
            expect(secondRowCells[1].innerHTML).contains('Dileu', 'Second cell does not contain correct value');
            expect(secondRowCells[1].querySelector('a').getAttribute('href')).equal(
                `/remove-pending-subscription?court=${mockCourt3.locationId}`
            );

            const thirdRowCells = rows[2].getElementsByClassName('govuk-table__cell');
            expect(thirdRowCells[0].innerHTML).contains(
                mockCourt2.welshName,
                'First cell does not contain correct value'
            );
            expect(thirdRowCells[1].innerHTML).contains('Dileu', 'Second cell does not contain correct value');
            expect(thirdRowCells[1].querySelector('a').getAttribute('href')).equal(
                `/remove-pending-subscription?court=${mockCourt2.locationId}`
            );
        });

        it('should display correct list type table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[1]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('Math o restr', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Camau gweithredu', 'Could not find text in second header');
        });

        it('should display correct list language table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[2]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('Fersiwn', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Camau gweithredu', 'Could not find text in second header');
        });

        it('should contain 1 row in the list type table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[1]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(1, 'List Type table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains(mockWelshListTypeText, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Dileu', 'Second cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(
                `/remove-pending-subscription?list-type=${mockListTypeValue}`
            );
        });

        it('should contain 1 row in the list language table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[2]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(1, 'List Language table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains('Saesneg', 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Newid', 'Second cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(`/subscription-add-list-language`);
        });
    });

    describe('user with court subscription but without case and list type subscriptions', () => {
        beforeAll(async () => {
            app.request['user'] = { userId: '5', roles: 'VERIFIED' };
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
                `/remove-pending-subscription?court=${mockCourt.locationId}`
            );
        });

        it('should display correct list type table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[1]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('List type', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Actions', 'Could not find text in second header');
        });

        it('should display correct list language table headers', () => {
            const tableHeaders = htmlRes
                .getElementsByClassName('govuk-table')[2]
                .getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('Version', 'Could not find text in first header');
            expect(tableHeaders[1].innerHTML).contains('Actions', 'Could not find text in second header');
        });

        it('should contain 1 row in the list language table with correct values', () => {
            const rows = htmlRes
                .getElementsByClassName('govuk-table__body')[2]
                .getElementsByClassName('govuk-table__row');
            const cells = rows[0].getElementsByClassName('govuk-table__cell');
            expect(rows.length).equal(1, 'List Language table did not contain expected number of rows');
            expect(cells[0].innerHTML).contains(mockListLanguageText, 'First cell does not contain correct value');
            expect(cells[1].innerHTML).contains('Change', 'Fourth cell does not contain correct value');
            expect(cells[1].querySelector('a').getAttribute('href')).equal(`/subscription-add-list-language`);
        });

        it('should contain confirm subscriptions button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains(btnConfirmSubscription, 'Could not find submit button');
        });

        it('should display add another email subscription link', () => {
            const addAnotherLink = htmlRes.getElementsByTagName('a')[12];
            expect(addAnotherLink.innerHTML).contains(
                'Select List Types',
                'Could not find add another email subscription link'
            );

            expect(addAnotherLink.getAttribute('href')).equal(
                '/subscription-add-list',
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
                `/remove-pending-subscription?case-number=${mockCase.caseNumber}`
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
                `/remove-pending-subscription?case-urn=${mockUrnCase.caseUrn}`
            );
        });

        it('should not contain any row in the court table', () => {
            const rows = htmlRes.getElementsByClassName('govuk-table__body')[1];
            expect(rows).equal(undefined, 'Case table did not contain expected number of rows');
        });

        it('should contain confirm subscriptions button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains(btnConfirmSubscription, 'Could not find submit button');
        });

        it('should display add another email subscription link', () => {
            const addAnotherLink = htmlRes.getElementsByTagName('a')[11];
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
                .get(`${PAGE_URL}?error=true`)
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
