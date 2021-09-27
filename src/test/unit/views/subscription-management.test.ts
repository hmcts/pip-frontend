import {expect} from 'chai';
import request from 'supertest';

import {app} from '../../../main/app';

const PAGE_URL = '/subscription-management';
const expectedAllSubsTitle = 'All subscriptions (9)';
const expectedCaseSubsTitle = 'Subscriptions by case (3)';
const expectedCourtSubsTitle = 'Subscriptions by court or tribunal (6)';
const expectedAddSubscriptionButton = 'Add new subscription';
const tabsClass = 'moj-sub-navigation__link';
const caseNameColumn = 'Case name';
const caseReferenceColumn = 'Case reference number';
const dateAddedColumn = 'Date added';
const actionsColumn = 'Actions';
const courtNameColumn = 'Court or tribunal name';

let htmlRes: Document;

describe('Subscription Management Page', () => {
  beforeAll(async () => {
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
    const subscriptionsTabs = htmlRes.getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[0].innerHTML)
      .contains(expectedAllSubsTitle, 'Could not find all subscriptions tab');
    expect(subscriptionsTabs[0].getAttribute('href'))
      .equal('?all', 'Tab does not contain proper link');
  });

  it('should display case subscriptions tab with proper link', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[1].innerHTML)
      .contains(expectedCaseSubsTitle, 'Could not find case subscriptions tab');
    expect(subscriptionsTabs[1].getAttribute('href'))
      .equal('?case', 'Tab does not contain proper link');
  });

  it('should display court subscriptions tab with proper link', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName(tabsClass);
    expect(subscriptionsTabs[2].innerHTML)
      .contains(expectedCourtSubsTitle, 'Could not find court subscriptions tab');
    expect(subscriptionsTabs[2].getAttribute('href'))
      .equal('?court', 'Tab does not contain proper link');
  });

  it('should display first tab as active', () => {
    const subscriptionsTabs = htmlRes.getElementsByClassName(tabsClass);
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
});
