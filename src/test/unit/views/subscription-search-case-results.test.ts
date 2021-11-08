import {expect} from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import {app} from '../../../main/app';
import fs from 'fs';
import path from 'path';
import {HearingRequests} from '../../../main/resources/requests/hearingRequests';

const searchTerm = 'ABC12345';
const numOfResults = '1';
const resultFound = 'Result successfully found';
const PAGE_URL = `/subscription-search-case-results?search-input=${searchTerm}`;

const rowClass = 'govuk-table__row';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionCaseList.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
sinon.stub(HearingRequests.prototype, 'getSubscriptionCaseDetails').returns(subscriptionsData);

describe('Search Results Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display back button', () => {
    const backButton = htmlRes.getElementsByClassName('govuk-back-link');
    expect(backButton[0].innerHTML).contains('Back', 'Back button does not contain correct text');
    expect(backButton[0].getAttribute('href')).equal('/subscription-case-search', 'Back button does not contain correct link');
  });

  it('should list the number of results found', () => {
    const bodyText = htmlRes.getElementsByClassName('govuk-heading-m');
    expect(bodyText[0].innerHTML).contains(resultFound, `Could find ${numOfResults} results in the body`);
  });

  it('should display first table header', () => {
    const tableHeader1 = htmlRes.getElementsByClassName('govuk-table__head');
    expect(tableHeader1[0].innerHTML).contains('Case reference number', 'Could not find text in first header');
  });

  it('should display second table header', () => {
    const tableHeader2 = htmlRes.getElementsByClassName('govuk-table__head');
    expect(tableHeader2[0].innerHTML).contains('Case name', 'Could not find text in second header');
  });


  it('should contain 2 rows including the header row', () => {
    const rows = htmlRes.getElementsByClassName(rowClass);
    expect(rows.length).equal(2, 'Table did not contain expected number of rows');
  });

  it('should contain rows with correct values', () => {
    const rows = htmlRes.getElementsByClassName(rowClass);
    const items = rows.item(1).children;

    expect(items[0].innerHTML).contains('ABC12345', 'URN does not exist');
    expect(items[1].innerHTML.replace('&amp;','&')).contains('John Smith v B&Q PLC', 'Case number does not exist');
  });
});
