import { app } from '../../../main/app';
import { expect } from 'chai';
import { DateTime } from 'luxon';
import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import sinon from 'sinon';
import { LocationService } from '../../../main/service/locationService';

const PAGE_URL = '/subscription-management';
const expectedAllSubsTitle = 'All subscriptions (9)';
const expectedCaseSubsTitle = 'Subscriptions by case (6)';
const expectedCourtSubsTitle = 'Subscriptions by court or tribunal (3)';
const expectedAllSubsTitleWithSingleSubs = 'All subscriptions (1)';
const expectedCaseSubsTitleWithNoLocationSubs = 'Subscriptions by case (1)';
const expectedCaseSubsTitleWithNoCaseSubs = 'Subscriptions by court or tribunal (1)';
const expectedAddSubscriptionButton = 'Add email subscription';
const expectedBulkUnsubscribeButton = 'Bulk unsubscribe';
const expectedListTypesToSendButton = 'Select which list types to receive';
const tabsClass = 'moj-sub-navigation__link';
const caseNameColumn = 'Case name';
const partyNamesColumn = 'Party name(s)';
const caseReferenceColumn = 'Reference number';
const dateAddedColumn = 'Date added';
const actionsColumn = 'Actions';
const courtNameColumn = 'Court or tribunal name';
const expectedRowCaseName = 'Test Name';
const expectedRowPartyName = 'PARTYNAME3';
const expectedRowCaseReference = 'C123123';
const expectedRowCaseUrn = 'K123123';
const expectedRowDateAdded = DateTime.fromISO('2022-08-01T01:10:10.111111').toFormat('dd MMMM yyyy');
const expectedRowCourtName = 'Aberdeen Tribunal Hearing Centre';
const expectedCaseRowsCount = 6;
const expectedCaseRowsCountWithoutLocation = 1;
const expectedCourtRowsCount = 3;
const expectedCourtRowsCountWithoutCaseSubs = 1;
const expectedUnsubscribeLink = 'delete-subscription?subscription=5a45699f-47e3-4283-904a-581afe624155';
const pageHeader = 'Your email subscriptions';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const userSubscriptionsStub = sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions');
const locationStub = sinon.stub(LocationService.prototype, 'getLocationById');

userSubscriptionsStub.withArgs('2').returns({ caseSubscriptions: [], locationSubscriptions: [] });
userSubscriptionsStub.withArgs('1').returns(subscriptionsData.data);

userSubscriptionsStub.withArgs('3').returns({
    caseSubscriptions: [
        {
            subscriptionId: '5a45699f-47e3-4283-904a-581afe624155',
            caseName: 'Test Name',
            caseNumber: 'C123123',
            urn: 'K123123',
            partyNames: 'PARTYNAME3',
            dateAdded: '2022-08-01T01:10:10.111111',
            searchType: 'CASE_ID',
        },
    ],
    locationSubscriptions: [],
});

userSubscriptionsStub.withArgs('4').returns({
    caseSubscriptions: [],
    locationSubscriptions: [
        {
            subscriptionId: 'f038b7ea-2972-4be4-a5ff-70abb4f78686',
            locationName: 'Court 1',
            dateAdded: '2022-08-01T01:10:10.111111',
            locationId: 1,
        },
    ],
});

userSubscriptionsStub.withArgs('5').returns({
    caseSubscriptions: [
        {
            subscriptionId: '252899d6-2b05-43ec-86e0-a438d3854fa8',
            caseName: '',
            caseNumber: '',
            urn: 'K123123',
            partyNames: '',
            dateAdded: '2022-08-01T01:10:10.111111',
            searchType: 'CASE_URN',
        },
    ],
    locationSubscriptions: [],
});

locationStub.withArgs(1).resolves({
    locationId: 1,
    name: 'Aberdeen Tribunal Hearing Centre',
    welshName: 'Welsh Test Court 1',
});

locationStub.withArgs(2).resolves({
    locationId: 2,
    name: 'Manchester Crown Court',
    welshName: 'Welsh Test Court 1',
});

locationStub.withArgs(3).resolves({
    locationId: 3,
    name: "Barkingside Magistrates' Court",
    welshName: 'Welsh Test Court 1',
});

let htmlRes: Document;

describe('Subscriptions Management Page No UserSubscriptions', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '2', roles: 'VERIFIED' };
    });

    it('should display no subscription message ', async () => {
        await request(app)
            .get(PAGE_URL + '?all')
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
                const message = htmlRes.getElementsByClassName('govuk-body');
                expect(message[0].innerHTML).contains(
                    'You do not have any active subscriptions',
                    'Could not find correct message'
                );
            });
    });

    it('should display no subscription case message ', async () => {
        await request(app)
            .get(PAGE_URL + '?case')
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
                const message = htmlRes.getElementsByClassName('govuk-body');
                expect(message[0].innerHTML).contains(
                    'You do not have any active subscriptions',
                    'Could not find correct message'
                );
            });
    });

    it('should display no subscription court message ', async () => {
        await request(app)
            .get(PAGE_URL + '?court')
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
                const message = htmlRes.getElementsByClassName('govuk-body');
                expect(message[0].innerHTML).contains(
                    'You do not have any active subscriptions',
                    'Could not find correct message'
                );
            });
    });
});

describe('Subscriptions Management Page', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '1', roles: 'VERIFIED' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l')[0];
        expect(header.innerHTML).contains(pageHeader, 'Could not find correct value in header');
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(pageHeader, 'Page title does not match header');
    });

    it('should display add subscription button', () => {
        const newSubsButton = htmlRes.getElementsByClassName('govuk-button');
        expect(newSubsButton[0].innerHTML).contains(
            expectedAddSubscriptionButton,
            'Could not find new subscription button'
        );
    });

    it('should display bulk unsubscribe button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button');
        expect(button[1].innerHTML).contains(expectedBulkUnsubscribeButton, 'Could not find bulk unsubscribe button');
    });

    it('should display all subscriptions tab with proper link', () => {
        const subscriptionsTabs = htmlRes
            .getElementsByClassName('moj-sub-navigation')[1]
            .getElementsByClassName(tabsClass);
        expect(subscriptionsTabs[0].innerHTML).contains(expectedAllSubsTitle, 'Could not find all subscriptions tab');
        expect(subscriptionsTabs[0].getAttribute('href')).equal('?all', 'Tab does not contain proper link');
    });

    it('should display case subscriptions tab with proper link', () => {
        const subscriptionsTabs = htmlRes
            .getElementsByClassName('moj-sub-navigation')[1]
            .getElementsByClassName(tabsClass);
        expect(subscriptionsTabs[1].innerHTML).contains(expectedCaseSubsTitle, 'Could not find case subscriptions tab');
        expect(subscriptionsTabs[1].getAttribute('href')).equal('?case', 'Tab does not contain proper link');
    });

    it('should display court subscriptions tab with proper link', () => {
        const subscriptionsTabs = htmlRes
            .getElementsByClassName('moj-sub-navigation')[1]
            .getElementsByClassName(tabsClass);
        expect(subscriptionsTabs[2].innerHTML).contains(
            expectedCourtSubsTitle,
            'Could not find court subscriptions tab'
        );
        expect(subscriptionsTabs[2].getAttribute('href')).equal('?location', 'Tab does not contain proper link');
    });

    it('should display first tab as active', () => {
        const subscriptionsTabs = htmlRes
            .getElementsByClassName('moj-sub-navigation')[1]
            .getElementsByClassName(tabsClass);
        expect(subscriptionsTabs[0].getAttribute('aria-current')).equal(
            'page',
            'All subscriptions tab does not have active attribute'
        );
    });

    it('should display case subscriptions table with 5 columns', () => {
        const casesHeaders = htmlRes.getElementById('cases-table').getElementsByClassName('govuk-table__header');
        expect(casesHeaders.length).equal(5);
    });

    it('should have correct columns in the cases table', () => {
        const caseHeaders = htmlRes.getElementById('cases-table').getElementsByClassName('govuk-table__header');
        expect(caseHeaders[0].innerHTML).contains(caseNameColumn, 'Case name header is not present');
        expect(caseHeaders[1].innerHTML).contains(partyNamesColumn, 'Party names header is not present');
        expect(caseHeaders[2].innerHTML).contains(caseReferenceColumn, 'Case reference header is not present');
        expect(caseHeaders[3].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
        expect(caseHeaders[4].innerHTML).contains(actionsColumn, 'Actions header is not present');
    });

    it('should display court subscriptions table with 3 columns', () => {
        const courtHeaders = htmlRes.getElementById('locations-table').getElementsByClassName('govuk-table__header');
        expect(courtHeaders.length).equal(3);
    });

    it('should have correct columns in the courts table', () => {
        const courtHeaders = htmlRes.getElementById('locations-table').getElementsByClassName('govuk-table__header');
        expect(courtHeaders[0].innerHTML).contains(courtNameColumn, 'Court name header is not present');
        expect(courtHeaders[1].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
        expect(courtHeaders[2].innerHTML).contains(actionsColumn, 'Actions header is not present');
    });

    it('requests cell should contain a link to delete subscription page', () => {
        const actionsCell = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__cell')[4];
        expect(actionsCell.innerHTML).contains('Unsubscribe');
        expect(actionsCell.querySelector('a').getAttribute('href')).equal(expectedUnsubscribeLink);
    });

    it('case table should have correct number of rows', () => {
        const subscriptionsCaseRows = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__row');
        expect(subscriptionsCaseRows.length).equal(expectedCaseRowsCount);
    });

    it('case table should have correct column values', () => {
        const subscriptionCaseRowCells = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__cell');
        expect(subscriptionCaseRowCells[0].innerHTML).contains(expectedRowCaseName);
        expect(subscriptionCaseRowCells[1].innerHTML).contains(expectedRowPartyName);
        expect(subscriptionCaseRowCells[2].innerHTML).contains(expectedRowCaseReference);
        expect(subscriptionCaseRowCells[3].innerHTML).contains(expectedRowDateAdded);
    });

    it('case table should be sorted by case name then case number', () => {
        const subscriptionCaseRowCells = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__cell');

        expect(subscriptionCaseRowCells[0].innerHTML).equal('Test Name');
        expect(subscriptionCaseRowCells[1].innerHTML).equal('PARTYNAME3');
        expect(subscriptionCaseRowCells[2].innerHTML).equal('C123123');

        expect(subscriptionCaseRowCells[5].innerHTML).equal('Test Name 2');
        expect(subscriptionCaseRowCells[6].innerHTML).equal('');
        expect(subscriptionCaseRowCells[7].innerHTML).equal('I123123');

        expect(subscriptionCaseRowCells[10].innerHTML).equal('Test Name 3');
        expect(subscriptionCaseRowCells[11].innerHTML).equal('');
        expect(subscriptionCaseRowCells[12].innerHTML).equal('1212121212');

        expect(subscriptionCaseRowCells[15].innerHTML).equal('Test Name 3');
        expect(subscriptionCaseRowCells[16].innerHTML).equal('');
        expect(subscriptionCaseRowCells[17].innerHTML).equal('B123123');

        expect(subscriptionCaseRowCells[20].innerHTML).equal('');
        expect(subscriptionCaseRowCells[21].innerHTML).equal('');
        expect(subscriptionCaseRowCells[22].innerHTML).equal('A123123');

        expect(subscriptionCaseRowCells[25].innerHTML).equal('');
        expect(subscriptionCaseRowCells[26].innerHTML).contains('PARTYNAME1');
        expect(subscriptionCaseRowCells[26].innerHTML).contains('PARTYNAME2');
        expect(subscriptionCaseRowCells[27].innerHTML).equal('D123123');
    });

    it('court table should have correct number of rows', () => {
        const subscriptionsCaseRows = htmlRes
            .getElementsByClassName('govuk-table__body')[1]
            .getElementsByClassName('govuk-table__row');
        expect(subscriptionsCaseRows.length).equal(expectedCourtRowsCount);
    });

    it('court table should have correct column values', () => {
        const subscriptionCaseRowCells = htmlRes
            .getElementsByClassName('govuk-table__body')[1]
            .getElementsByClassName('govuk-table__cell');
        expect(subscriptionCaseRowCells[0].innerHTML).contains(expectedRowCourtName);
        expect(subscriptionCaseRowCells[1].innerHTML).contains(expectedRowDateAdded);
    });

    it('court table should be sorted by court name', () => {
        const subscriptionCaseRowCells = htmlRes
            .getElementsByClassName('govuk-table__body')[1]
            .getElementsByClassName('govuk-table__cell');

        expect(subscriptionCaseRowCells[0].innerHTML).equal('Aberdeen Tribunal Hearing Centre');
        expect(subscriptionCaseRowCells[3].innerHTML).equal("Barkingside Magistrates' Court");
        expect(subscriptionCaseRowCells[6].innerHTML).equal('Manchester Crown Court');
    });
});

describe('Subscriptions Management Page with case subscription but without location', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '3', roles: 'VERIFIED' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l')[0];
        expect(header.innerHTML).contains(pageHeader, 'Could not find correct value in header');
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(pageHeader, 'Page title does not match header');
    });

    it('should display add subscription button', () => {
        const newSubsButton = htmlRes.getElementsByClassName('govuk-button');
        expect(newSubsButton[0].innerHTML).contains(
            expectedAddSubscriptionButton,
            'Could not find new subscription button'
        );
    });

    it('should display bulk unsubscribe button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button');
        expect(button[1].innerHTML).contains(expectedBulkUnsubscribeButton, 'Could not find bulk unsubscribe button');
    });

    it('should display all subscriptions tab with proper link', () => {
        const subscriptionsTabs = htmlRes
            .getElementsByClassName('moj-sub-navigation')[1]
            .getElementsByClassName(tabsClass);
        expect(subscriptionsTabs[0].innerHTML).contains(
            expectedAllSubsTitleWithSingleSubs,
            'Could not find all subscriptions tab'
        );
        expect(subscriptionsTabs[0].getAttribute('href')).equal('?all', 'Tab does not contain proper link');
    });

    it('should display case subscriptions tab with proper link', () => {
        const subscriptionsTabs = htmlRes
            .getElementsByClassName('moj-sub-navigation')[1]
            .getElementsByClassName(tabsClass);
        expect(subscriptionsTabs[1].innerHTML).contains(
            expectedCaseSubsTitleWithNoLocationSubs,
            'Could not find case subscriptions tab'
        );
        expect(subscriptionsTabs[1].getAttribute('href')).equal('?case', 'Tab does not contain proper link');
    });

    it('should display first tab as active', () => {
        const subscriptionsTabs = htmlRes
            .getElementsByClassName('moj-sub-navigation')[1]
            .getElementsByClassName(tabsClass);
        expect(subscriptionsTabs[0].getAttribute('aria-current')).equal(
            'page',
            'All subscriptions tab does not have active attribute'
        );
    });

    it('should display case subscriptions table with 5 columns', () => {
        const casesHeaders = htmlRes.getElementById('cases-table').getElementsByClassName('govuk-table__header');
        expect(casesHeaders.length).equal(5);
    });

    it('should have correct columns in the cases table', () => {
        const caseHeaders = htmlRes.getElementById('cases-table').getElementsByClassName('govuk-table__header');
        expect(caseHeaders[0].innerHTML).contains(caseNameColumn, 'Case name header is not present');
        expect(caseHeaders[1].innerHTML).contains(partyNamesColumn, 'Party names header is not present');
        expect(caseHeaders[2].innerHTML).contains(caseReferenceColumn, 'Case reference header is not present');
        expect(caseHeaders[3].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
        expect(caseHeaders[4].innerHTML).contains(actionsColumn, 'Actions header is not present');
    });

    it('should not display court subscriptions table with 3 columns', () => {
        const courtHeaders = htmlRes.getElementById('locations-table');
        expect(courtHeaders).equal(null);
    });

    it('should have correct columns in the locations table', () => {
        const courtHeaders = htmlRes.getElementById('locations-table');
        expect(courtHeaders).equal(null, 'Court name header is not present');
    });

    it('requests cell should contain a link to delete subscription page', () => {
        const actionsCell = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__cell')[4];
        expect(actionsCell.innerHTML).contains('Unsubscribe');
        expect(actionsCell.querySelector('a').getAttribute('href')).equal(expectedUnsubscribeLink);
    });

    it('case table should have correct number of rows', () => {
        const subscriptionsCaseRows = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__row');
        expect(subscriptionsCaseRows.length).equal(expectedCaseRowsCountWithoutLocation);
    });

    it('case table should have correct column values', () => {
        const subscriptionCaseRowCells = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__cell');
        expect(subscriptionCaseRowCells[0].innerHTML).contains(expectedRowCaseName);
        expect(subscriptionCaseRowCells[1].innerHTML).contains(expectedRowPartyName);
        expect(subscriptionCaseRowCells[2].innerHTML).contains(expectedRowCaseReference);
        expect(subscriptionCaseRowCells[3].innerHTML).contains(expectedRowDateAdded);
    });

    it('court table should have correct number of rows', () => {
        const subscriptionsLocationRows = htmlRes.getElementsByClassName('govuk-table__body')[1];
        expect(subscriptionsLocationRows).equal(undefined);
    });
});

describe('Subscriptions Management Page with location subscription but without case', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '4', roles: 'VERIFIED' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l')[0];
        expect(header.innerHTML).contains(pageHeader, 'Could not find correct value in header');
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(pageHeader, 'Page title does not match header');
    });

    it('should display add subscription button', () => {
        const newSubsButton = htmlRes.getElementsByClassName('govuk-button');
        expect(newSubsButton[0].innerHTML).contains(
            expectedAddSubscriptionButton,
            'Could not find new subscription button'
        );
    });

    it('should display bulk unsubscribe button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button');
        expect(button[1].innerHTML).contains(expectedBulkUnsubscribeButton, 'Could not find bulk unsubscribe button');
    });

    it('should display all subscriptions tab with proper link', () => {
        const subscriptionsTabs = htmlRes
            .getElementsByClassName('moj-sub-navigation')[1]
            .getElementsByClassName(tabsClass);
        expect(subscriptionsTabs[0].innerHTML).contains(
            expectedAllSubsTitleWithSingleSubs,
            'Could not find all subscriptions tab'
        );
        expect(subscriptionsTabs[0].getAttribute('href')).equal('?all', 'Tab does not contain proper link');
    });

    it('should display court subscriptions tab with proper link', () => {
        const subscriptionsTabs = htmlRes
            .getElementsByClassName('moj-sub-navigation')[1]
            .getElementsByClassName(tabsClass);
        expect(subscriptionsTabs[2].innerHTML).contains(
            expectedCaseSubsTitleWithNoCaseSubs,
            'Could not find court subscriptions tab'
        );
        expect(subscriptionsTabs[2].getAttribute('href')).equal('?location', 'Tab does not contain proper link');
    });

    it('should display first tab as active', () => {
        const subscriptionsTabs = htmlRes
            .getElementsByClassName('moj-sub-navigation')[1]
            .getElementsByClassName(tabsClass);
        expect(subscriptionsTabs[0].getAttribute('aria-current')).equal(
            'page',
            'All subscriptions tab does not have active attribute'
        );
    });

    it('should not display case subscriptions table with 5 columns', () => {
        const casesHeaders = htmlRes.getElementById('cases-table');
        expect(casesHeaders).equal(null);
    });

    it('should not have columns in the cases table', () => {
        const caseHeaders = htmlRes.getElementById('cases-table');
        expect(caseHeaders).equal(null, 'Case name header is not present');
    });

    it('should display court subscriptions table with 3 columns', () => {
        const courtHeaders = htmlRes.getElementById('locations-table').getElementsByClassName('govuk-table__header');
        expect(courtHeaders.length).equal(3);
    });

    it('should have correct columns in the courts table', () => {
        const courtHeaders = htmlRes.getElementById('locations-table').getElementsByClassName('govuk-table__header');
        expect(courtHeaders[0].innerHTML).contains(courtNameColumn, 'Court name header is not present');
        expect(courtHeaders[1].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
        expect(courtHeaders[2].innerHTML).contains(actionsColumn, 'Actions header is not present');
    });

    it('requests cell should contain a link to delete subscription page', () => {
        const actionsCell = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__cell')[2];
        expect(actionsCell.innerHTML).contains('Unsubscribe');
    });

    it('court table should have correct number of rows', () => {
        const subscriptionsLocationRows = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__row');
        expect(subscriptionsLocationRows.length).equal(expectedCourtRowsCountWithoutCaseSubs);
    });

    it('court table should have correct column values', () => {
        const subscriptionLocationRowCells = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__cell');
        expect(subscriptionLocationRowCells[0].innerHTML).contains(expectedRowCourtName);
        expect(subscriptionLocationRowCells[1].innerHTML).contains(expectedRowDateAdded);
    });

    it('should show the list types to receive button', () => {
        const listTypesToReceiveButton = htmlRes.getElementsByClassName('govuk-button');
        expect(listTypesToReceiveButton[2].innerHTML).contains(
            expectedListTypesToSendButton,
            'Could not find list types to receive button'
        );
        expect(listTypesToReceiveButton[2].outerHTML).contains(
            '<a href="subscription-configure-list"',
            'href link not found inside the button'
        );
    });
});

describe('Subscriptions Management Page with case URN subscription only', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '5', roles: 'VERIFIED' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display case subscriptions table with 5 columns', () => {
        const casesHeaders = htmlRes.getElementById('cases-table').getElementsByClassName('govuk-table__header');
        expect(casesHeaders.length).equal(5);
    });

    it('should have correct columns in the cases table', () => {
        const caseHeaders = htmlRes.getElementById('cases-table').getElementsByClassName('govuk-table__header');
        expect(caseHeaders[0].innerHTML).contains(caseNameColumn, 'Case name header is not present');
        expect(caseHeaders[1].innerHTML).contains(partyNamesColumn, 'Party names header is not present');
        expect(caseHeaders[2].innerHTML).contains(caseReferenceColumn, 'Case reference header is not present');
        expect(caseHeaders[3].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
        expect(caseHeaders[4].innerHTML).contains(actionsColumn, 'Actions header is not present');
    });

    it('should not display the locations table', () => {
        const courtHeaders = htmlRes.getElementById('locations-table');
        expect(courtHeaders).equal(null, 'Court name header is not present');
    });

    it('case table should have correct number of rows', () => {
        const subscriptionsCaseRows = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__row');
        expect(subscriptionsCaseRows.length).equal(expectedCaseRowsCountWithoutLocation);
    });

    it('case table should have correct column values', () => {
        const subscriptionCaseRowCells = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__cell');
        expect(subscriptionCaseRowCells[0].innerHTML).to.be.empty;
        expect(subscriptionCaseRowCells[1].innerHTML).to.be.empty;
        expect(subscriptionCaseRowCells[2].innerHTML).contains(expectedRowCaseUrn);
        expect(subscriptionCaseRowCells[3].innerHTML).contains(expectedRowDateAdded);
    });
});
