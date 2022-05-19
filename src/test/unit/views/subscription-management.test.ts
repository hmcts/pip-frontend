import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import request from 'supertest';
import sinon from 'sinon';

const PAGE_URL = '/subscription-management';
const expectedAllSubsTitle = 'All subscriptions (5)';
const expectedCaseSubsTitle = 'Subscriptions by case (2)';
const expectedCourtSubsTitle = 'Subscriptions by court or tribunal (3)';
const expectedAddSubscriptionButton = 'Add email subscription';
const tabsClass = 'moj-sub-navigation__link';
const caseNameColumn = 'Case name';
const caseReferenceColumn = 'Case reference number';
const dateAddedColumn = 'Date added';
const actionsColumn = 'Actions';
const courtNameColumn = 'Court or tribunal name';
const expectedRowCaseName = 'Tom Clancy';
const expectedRowCaseReference = 'T485913';
const expectedRowDateAdded = moment('2022-01-14T11:30:12.357299').format('MMM Do YYYY');
const expectedRowCourtName = 'Court 1';
const expectedCaseRowsCount = 2;
const expectedCourtRowsCount = 3;
const expectedUnsubscribeLink = 'delete-subscription?subscription=5a45699f-47e3-4283-904a-581afe624155';
const pageHeader = 'Your email subscriptions';
const rawData = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const userSubscriptionsStub = sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions');
userSubscriptionsStub.withArgs('2').returns({caseSubscriptions:[], courtSubscriptions:[]});
userSubscriptionsStub.withArgs('1').returns(subscriptionsData.data);
sinon.stub(expressRequest, 'isAuthenticated').returns(true);

let htmlRes: Document;

describe('Subscriptions Management Page No UserSubscriptions', () => {
  beforeAll(async () => {
    app.request['user'] = {oid: '2'};
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
    app.request['user'] = {oid: '1'};
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
      .equal('?court', 'Tab does not contain proper link');
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
    const courtHeaders = htmlRes.getElementById('courts-table')
      .getElementsByClassName('govuk-table__header');
    expect(courtHeaders.length).equal(3);
  });

  it('should have correct columns in the courts table', () => {
    const courtHeaders = htmlRes.getElementById('courts-table')
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
