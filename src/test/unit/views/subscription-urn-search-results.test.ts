import {expect} from 'chai';
import request from 'supertest';
import {app} from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {SubscriptionRequests} from '../../../main/resources/requests/subscriptionRequests';

const searchTerm = '123456789';
const numOfResults = '1';
const PAGE_URL = `/subscription-urn-search-results?search-input=${searchTerm}`;
const backLinkClass = 'govuk-back-link';
const rowClass = 'govuk-table__row';
const tableBodyClass = 'govuk-table__body';
const tableHeaderClass = 'govuk-table__head';
let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
sinon.stub(SubscriptionRequests.prototype, 'getSubscriptionByUrn').returns(subscriptionsData);

jest.mock('axios', () => {
  return {
    create: function(): { get: () => Promise<any> } {
      return {
        get: function(): Promise<any> {return new Promise((resolve) => resolve({data: subscriptionsData}));},
      };
    },
  };
});

describe('Search Results Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display back button', () => {
    const backButton = htmlRes.getElementsByClassName(backLinkClass);
    expect(backButton[0].innerHTML).contains('Back', 'Back button does not contain correct text');
    expect(backButton[0].getAttribute('href')).equal('#', 'Back button does not contain correct link');
  });

  it('should list the number of results found', () => {
    const bodyText = htmlRes.getElementsByClassName(tableBodyClass);
    expect(bodyText[0].innerHTML).contains(numOfResults, `Could not find ${numOfResults} results in the body`);
  });

  it('should display first table header', () => {
    const tableHeader1 = htmlRes.getElementsByClassName(tableHeaderClass);
    expect(tableHeader1[0].innerHTML).contains('Unique reference number', 'Could not find text in first header');
  });

  it('should display second table header', () => {
    const tableHeader2 = htmlRes.getElementsByClassName(tableHeaderClass);
    expect(tableHeader2[0].innerHTML).contains('Case reference number', 'Could not find text in second header');
  });

  it('should contain 2 rows including the header row', () => {
    const rows = htmlRes.getElementsByClassName(rowClass);
    expect(rows.length).equal(2, 'Table did not contain expected number of rows');
  });

  it('should contain rows with correct values', () => {
    const rows = htmlRes.getElementsByClassName(rowClass);
    const items = rows.item(1).children;

    expect(items[0].innerHTML).contains('123456789', 'URN does not exist');
    expect(items[1].innerHTML).contains('63-694-7292', 'Case number does not exist');
  });

});
