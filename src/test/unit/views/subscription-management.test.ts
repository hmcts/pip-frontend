import { app } from '../../../main/app';
import { expect } from 'chai';
import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import request from 'supertest';
import sinon from 'sinon';
import {LocationService} from '../../../main/service/locationService';

const PAGE_URL = '/subscription-management';
const expectedAllSubsTitle = 'All subscriptions (5)';
const expectedCaseSubsTitle = 'Subscriptions by case (2)';
const expectedCourtSubsTitle = 'Subscriptions by court or tribunal (3)';
const expectedAllSubsTitleWithSingleSubs = 'All subscriptions (1)';
const expectedCaseSubsTitleWithNoLocationSubs = 'Subscriptions by case (1)';
const expectedCaseSubsTitleWithNoCaseSubs = 'Subscriptions by court or tribunal (1)';
const expectedAddSubscriptionButton = 'Add email subscription';
const expectedBulkDeleteSubscriptionsButton = 'Bulk delete subscriptions';
const expectedListTypesToSendButton = 'Select which list types to receive';
const tabsClass = 'moj-sub-navigation__link';
const caseNameColumn = 'Case name';
const caseReferenceColumn = 'Case reference number';
const dateAddedColumn = 'Date added';
const actionsColumn = 'Actions';
const courtNameColumn = 'Court or tribunal name';
const expectedRowCaseName = 'Tom Clancy';
const expectedRowCaseReference = 'T485913';
const expectedRowDateAdded = moment('2022-01-14T11:30:12.357299').format('DD MMMM YYYY');
const expectedRowCourtName = 'Test court 1';
const expectedCaseRowsCount = 2;
const expectedCaseRowsCountWithoutLocation = 1;
const expectedCourtRowsCount = 3;
const expectedCourtRowsCountWithoutCaseSubs = 1;
const expectedUnsubscribeLink = 'delete-subscription?subscription=5a45699f-47e3-4283-904a-581afe624155';
const pageHeader = 'Your email subscriptions';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const userSubscriptionsStub = sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions');
const locationStub = sinon.stub(LocationService.prototype, 'getLocationById');

userSubscriptionsStub.withArgs('2').returns({caseSubscriptions:[], locationSubscriptions:[]});
userSubscriptionsStub.withArgs('1').returns(subscriptionsData.data);
locationStub.withArgs(1).resolves({
  locationId: 1,
  name: 'Test court 1',
  welshName: 'Welsh Test Court 1',
});

userSubscriptionsStub.withArgs('3').returns(
  {caseSubscriptions:[{
    subscriptionId: '5a45699f-47e3-4283-904a-581afe624155',
    caseName: 'Tom Clancy',
    caseNumber: 'T485913',
    urn: 'N363N6R4OG',
    dateAdded: '2022-01-14T11:30:12.357299',
  }], locationSubscriptions:[]});

userSubscriptionsStub.withArgs('4').returns(
  {caseSubscriptions:[], locationSubscriptions:[{
    subscriptionId: 'f038b7ea-2972-4be4-a5ff-70abb4f78686',
    locationName: 'Court 1',
    dateAdded: '2022-01-14T11:42:57.847708',
    locationId: 1,
  }]});

let htmlRes: Document;

describe('Subscriptions Management Page No UserSubscriptions', () => {
  beforeAll(async () => {
    app.request['user'] = {userId: '2', 'roles': 'VERIFIED'};
  });

  it('should display no subscription message ', async () => {
    await request(app).get(PAGE_URL + '?all').then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
      const message = htmlRes.getElementsByClassName('govuk-body');
      expect(message[0].innerHTML)
        .contains('You do not have any active subscriptions', 'Could not find correct message');
    });
  });

  it('should display no subscription case message ', async () => {
    await request(app).get(PAGE_URL + '?case').then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
      const message = htmlRes.getElementsByClassName('govuk-body');
      expect(message[0].innerHTML)
        .contains('You do not have any active subscriptions', 'Could not find correct message');
    });
  });

  it('should display no subscription court message ', async () => {
    await request(app).get(PAGE_URL + '?court').then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
      const message = htmlRes.getElementsByClassName('govuk-body');
      expect(message[0].innerHTML)
        .contains('You do not have any active subscriptions', 'Could not find correct message');
    });
  });
});

describe('Subscriptions Management Page', () => {
  beforeAll(async () => {
    app.request['user'] = {userId: '1', 'roles': 'VERIFIED'};
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l')[0];
    expect(header.innerHTML)
      .contains(pageHeader, 'Could not find correct value in header');
  });

  it('should have correct page title', () => {
    const pageTitle = htmlRes.title;
    expect(pageTitle).contains(pageHeader, 'Page title does not match header');
  });

  it('should display add subscription button', () => {
    const newSubsButton = htmlRes.getElementsByClassName('govuk-button');
    expect(newSubsButton[0].innerHTML)
      .contains(expectedAddSubscriptionButton, 'Could not find new subscription button');
  });

  it('should display bulk delete subscriptions button', () => {
    const button = htmlRes.getElementsByClassName('govuk-button');
    expect(button[1].innerHTML)
      .contains(expectedBulkDeleteSubscriptionsButton, 'Could not find bulk delete subscriptions button');
  });

  it('should display all subscriptions tab with proper link', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName('moj-sub-navigation')[1]
      .getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[0].innerHTML)
      .contains(expectedAllSubsTitle, 'Could not find all subscriptions tab');
    expect(subscriptionsTabs[0].getAttribute('href'))
      .equal('?all', 'Tab does not contain proper link');
  });

  it('should display case subscriptions tab with proper link', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName('moj-sub-navigation')[1]
      .getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[1].innerHTML)
      .contains(expectedCaseSubsTitle, 'Could not find case subscriptions tab');
    expect(subscriptionsTabs[1].getAttribute('href'))
      .equal('?case', 'Tab does not contain proper link');
  });

  it('should display court subscriptions tab with proper link', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName('moj-sub-navigation')[1]
      .getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[2].innerHTML)
      .contains(expectedCourtSubsTitle, 'Could not find court subscriptions tab');
    expect(subscriptionsTabs[2].getAttribute('href'))
      .equal('?location', 'Tab does not contain proper link');
  });

  it('should display first tab as active', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName('moj-sub-navigation')[1]
      .getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[0].getAttribute('aria-current'))
      .equal('page', 'All subscriptions tab does not have active attribute');
  });

  it('should display case subscriptions table with 4 columns', () => {
    const casesHeaders = htmlRes.getElementById('cases-table')
      .getElementsByClassName('govuk-table__header');
    expect(casesHeaders.length).equal(4);
  });

  it('should have correct columns in the cases table', () => {
    const caseHeaders = htmlRes.getElementById('cases-table')
      .getElementsByClassName('govuk-table__header');
    expect(caseHeaders[0].innerHTML).contains(caseNameColumn, 'Case name header is not present');
    expect(caseHeaders[1].innerHTML).contains(caseReferenceColumn, 'Case reference header is not present');
    expect(caseHeaders[2].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
    expect(caseHeaders[3].innerHTML).contains(actionsColumn, 'Actions header is not present');
  });

  it('should display court subscriptions table with 3 columns', () => {
    const courtHeaders = htmlRes.getElementById('locations-table')
      .getElementsByClassName('govuk-table__header');
    expect(courtHeaders.length).equal(3);
  });

  it('should have correct columns in the courts table', () => {
    const courtHeaders = htmlRes.getElementById('locations-table')
      .getElementsByClassName('govuk-table__header');
    expect(courtHeaders[0].innerHTML).contains(courtNameColumn, 'Court name header is not present');
    expect(courtHeaders[1].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
    expect(courtHeaders[2].innerHTML).contains(actionsColumn, 'Actions header is not present');
  });

  it('requests cell should contain a link to delete subscription page', () => {
    const actionsCell = htmlRes.getElementsByClassName('govuk-table__body')[0]
      .getElementsByClassName('govuk-table__cell')[3];
    expect(actionsCell.innerHTML).contains('Unsubscribe');
    expect(actionsCell.querySelector('a').getAttribute('href')).equal(expectedUnsubscribeLink);
  });

  it('case table should have correct number of rows', () => {
    const subscriptionsCaseRows = htmlRes.getElementsByClassName('govuk-table__body')[0]
      .getElementsByClassName('govuk-table__row');
    expect(subscriptionsCaseRows.length).equal(expectedCaseRowsCount);
  });

  it('case table should have correct column values', () => {
    const subscriptionCaseRowCells = htmlRes.getElementsByClassName('govuk-table__body')[0]
      .getElementsByClassName('govuk-table__cell');
    expect(subscriptionCaseRowCells[0].innerHTML).contains(expectedRowCaseName);
    expect(subscriptionCaseRowCells[1].innerHTML).contains(expectedRowCaseReference);
    expect(subscriptionCaseRowCells[2].innerHTML).contains(expectedRowDateAdded);
  });

  it('court table should have correct number of rows', () => {
    const subscriptionsCaseRows = htmlRes.getElementsByClassName('govuk-table__body')[1]
      .getElementsByClassName('govuk-table__row');
    expect(subscriptionsCaseRows.length).equal(expectedCourtRowsCount);
  });

  it('court table should have correct column values', () => {
    const subscriptionCaseRowCells = htmlRes.getElementsByClassName('govuk-table__body')[1]
      .getElementsByClassName('govuk-table__cell');
    expect(subscriptionCaseRowCells[0].innerHTML).contains(expectedRowCourtName);
    expect(subscriptionCaseRowCells[1].innerHTML).contains(expectedRowDateAdded);
  });
});

describe('Subscriptions Management Page with case subscription but without location', () => {
  beforeAll(async () => {
    app.request['user'] = {userId: '3', 'roles': 'VERIFIED'};
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l')[0];
    expect(header.innerHTML)
      .contains(pageHeader, 'Could not find correct value in header');
  });

  it('should have correct page title', () => {
    const pageTitle = htmlRes.title;
    expect(pageTitle).contains(pageHeader, 'Page title does not match header');
  });

  it('should display add subscription button', () => {
    const newSubsButton = htmlRes.getElementsByClassName('govuk-button');
    expect(newSubsButton[0].innerHTML)
      .contains(expectedAddSubscriptionButton, 'Could not find new subscription button');
  });

  it('should display bulk delete subscriptions button', () => {
    const button = htmlRes.getElementsByClassName('govuk-button');
    expect(button[1].innerHTML)
      .contains(expectedBulkDeleteSubscriptionsButton, 'Could not find bulk delete subscriptions button');
  });

  it('should display all subscriptions tab with proper link', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName('moj-sub-navigation')[1]
      .getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[0].innerHTML)
      .contains(expectedAllSubsTitleWithSingleSubs, 'Could not find all subscriptions tab');
    expect(subscriptionsTabs[0].getAttribute('href'))
      .equal('?all', 'Tab does not contain proper link');
  });

  it('should display case subscriptions tab with proper link', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName('moj-sub-navigation')[1]
      .getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[1].innerHTML)
      .contains(expectedCaseSubsTitleWithNoLocationSubs, 'Could not find case subscriptions tab');
    expect(subscriptionsTabs[1].getAttribute('href'))
      .equal('?case', 'Tab does not contain proper link');
  });

  it('should display first tab as active', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName('moj-sub-navigation')[1]
      .getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[0].getAttribute('aria-current'))
      .equal('page', 'All subscriptions tab does not have active attribute');
  });

  it('should display case subscriptions table with 4 columns', () => {
    const casesHeaders = htmlRes.getElementById('cases-table')
      .getElementsByClassName('govuk-table__header');
    expect(casesHeaders.length).equal(4);
  });

  it('should have correct columns in the cases table', () => {
    const caseHeaders = htmlRes.getElementById('cases-table')
      .getElementsByClassName('govuk-table__header');
    expect(caseHeaders[0].innerHTML).contains(caseNameColumn, 'Case name header is not present');
    expect(caseHeaders[1].innerHTML).contains(caseReferenceColumn, 'Case reference header is not present');
    expect(caseHeaders[2].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
    expect(caseHeaders[3].innerHTML).contains(actionsColumn, 'Actions header is not present');
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
    const actionsCell = htmlRes.getElementsByClassName('govuk-table__body')[0]
      .getElementsByClassName('govuk-table__cell')[3];
    expect(actionsCell.innerHTML).contains('Unsubscribe');
    expect(actionsCell.querySelector('a').getAttribute('href')).equal(expectedUnsubscribeLink);
  });

  it('case table should have correct number of rows', () => {
    const subscriptionsCaseRows = htmlRes.getElementsByClassName('govuk-table__body')[0]
      .getElementsByClassName('govuk-table__row');
    expect(subscriptionsCaseRows.length).equal(expectedCaseRowsCountWithoutLocation);
  });

  it('case table should have correct column values', () => {
    const subscriptionCaseRowCells = htmlRes.getElementsByClassName('govuk-table__body')[0]
      .getElementsByClassName('govuk-table__cell');
    expect(subscriptionCaseRowCells[0].innerHTML).contains(expectedRowCaseName);
    expect(subscriptionCaseRowCells[1].innerHTML).contains(expectedRowCaseReference);
    expect(subscriptionCaseRowCells[2].innerHTML).contains(expectedRowDateAdded);
  });

  it('court table should have correct number of rows', () => {
    const subscriptionsLocationRows = htmlRes.getElementsByClassName('govuk-table__body')[1];
    expect(subscriptionsLocationRows).equal(undefined);
  });
});

describe('Subscriptions Management Page with location subscription but without case', () => {
  beforeAll(async () => {
    app.request['user'] = {userId: '4','roles': 'VERIFIED'};
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l')[0];
    expect(header.innerHTML)
      .contains(pageHeader, 'Could not find correct value in header');
  });

  it('should have correct page title', () => {
    const pageTitle = htmlRes.title;
    expect(pageTitle).contains(pageHeader, 'Page title does not match header');
  });

  it('should display add subscription button', () => {
    const newSubsButton = htmlRes.getElementsByClassName('govuk-button');
    expect(newSubsButton[0].innerHTML)
      .contains(expectedAddSubscriptionButton, 'Could not find new subscription button');
  });

  it('should display bulk delete subscriptions button', () => {
    const button = htmlRes.getElementsByClassName('govuk-button');
    expect(button[1].innerHTML)
      .contains(expectedBulkDeleteSubscriptionsButton, 'Could not find bulk delete subscriptions button');
  });

  it('should display all subscriptions tab with proper link', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName('moj-sub-navigation')[1]
      .getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[0].innerHTML)
      .contains(expectedAllSubsTitleWithSingleSubs, 'Could not find all subscriptions tab');
    expect(subscriptionsTabs[0].getAttribute('href'))
      .equal('?all', 'Tab does not contain proper link');
  });

  it('should display court subscriptions tab with proper link', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName('moj-sub-navigation')[1]
      .getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[2].innerHTML)
      .contains(expectedCaseSubsTitleWithNoCaseSubs, 'Could not find court subscriptions tab');
    expect(subscriptionsTabs[2].getAttribute('href'))
      .equal('?location', 'Tab does not contain proper link');
  });

  it('should display first tab as active', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName('moj-sub-navigation')[1]
      .getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[0].getAttribute('aria-current'))
      .equal('page', 'All subscriptions tab does not have active attribute');
  });

  it('should not display case subscriptions table with 4 columns', () => {
    const casesHeaders = htmlRes.getElementById('cases-table');
    expect(casesHeaders).equal(null);
  });

  it('should not have columns in the cases table', () => {
    const caseHeaders = htmlRes.getElementById('cases-table');
    expect(caseHeaders).equal(null, 'Case name header is not present');
  });

  it('should display court subscriptions table with 3 columns', () => {
    const courtHeaders = htmlRes.getElementById('locations-table')
      .getElementsByClassName('govuk-table__header');
    expect(courtHeaders.length).equal(3);
  });

  it('should have correct columns in the courts table', () => {
    const courtHeaders = htmlRes.getElementById('locations-table')
      .getElementsByClassName('govuk-table__header');
    expect(courtHeaders[0].innerHTML).contains(courtNameColumn, 'Court name header is not present');
    expect(courtHeaders[1].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
    expect(courtHeaders[2].innerHTML).contains(actionsColumn, 'Actions header is not present');
  });

  it('requests cell should contain a link to delete subscription page', () => {
    const actionsCell = htmlRes.getElementsByClassName('govuk-table__body')[0]
      .getElementsByClassName('govuk-table__cell')[2];
    expect(actionsCell.innerHTML).contains('Unsubscribe');
  });

  it('court table should have correct number of rows', () => {
    const subscriptionsLocationRows = htmlRes.getElementsByClassName('govuk-table__body')[0]
      .getElementsByClassName('govuk-table__row');
    expect(subscriptionsLocationRows.length).equal(expectedCourtRowsCountWithoutCaseSubs);
  });

  it('court table should have correct column values', () => {
    const subscriptionLocationRowCells = htmlRes.getElementsByClassName('govuk-table__body')[0]
      .getElementsByClassName('govuk-table__cell');
    expect(subscriptionLocationRowCells[0].innerHTML).contains(expectedRowCourtName);
    expect(subscriptionLocationRowCells[1].innerHTML).contains(expectedRowDateAdded);
  });

  it('should show the list types to receive button', () => {
    const listTypesToReceiveButton = htmlRes.getElementsByClassName('govuk-button');
    expect(listTypesToReceiveButton[2].innerHTML)
      .contains(expectedListTypesToSendButton, 'Could not find list types to receive button');
    expect(listTypesToReceiveButton[2].outerHTML).contains('<a href="subscription-configure-list"',
      'href link not found inside the button');
  });
});
