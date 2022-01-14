import {expect} from 'chai';
import request from 'supertest';
import { request as expressRequest } from 'express';
import sinon from 'sinon';
import moment from 'moment';

import {app} from '../../../main/app';
import fs from 'fs';
import path from 'path';
import {SubscriptionRequests} from '../../../main/resources/requests/subscriptionRequests';

const PAGE_URL = '/subscription-management';
const expectedAllSubsTitle = 'All subscriptions (5)';
const expectedCaseSubsTitle = 'Subscriptions by case (2)';
const expectedCourtSubsTitle = 'Subscriptions by court or tribunal (3)';
const expectedAddSubscriptionButton = 'Add new subscription';
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

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions').returns(subscriptionsData.data);

describe('Subscription Management Page', () => {
  beforeAll(async () => {
    sinon.stub(expressRequest, 'isAuthenticated').returns(true);
    app.request['user'] = {id: '1'};

    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML)
      .contains('Your subscriptions', 'Could not find correct value in header');
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

  it('requests cell should contain a link', () => {
    const actionsCell = htmlRes.getElementsByClassName('govuk-table__body')[0]
      .getElementsByClassName('govuk-table__cell')[3];
    expect(actionsCell.innerHTML).contains('Unsubscribe');
    expect(actionsCell.querySelector('a').getAttribute('href')).equal('#');
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
