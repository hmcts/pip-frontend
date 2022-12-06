import { app } from '../../../main/app';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import sinon from 'sinon';
import {PublicationService} from '../../../main/service/publicationService';

const searchTerm = 'N363N6R4OG';
const numOfResults = '1';
const PAGE_URL = `/subscription-urn-search-results?search-input=${searchTerm}`;
const backLinkClass = 'govuk-back-link';
const rowClass = 'govuk-table__row';
const tableBodyClass = 'govuk-table__body';
const tableHeaderClass = 'govuk-table__head';
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData)[0].search.cases[0];
let htmlRes: Document;

sinon.stub(PublicationService.prototype, 'getCaseByCaseUrn').returns(subscriptionsData);

app.request['user'] = {'roles': 'VERIFIED'};

const pageTitleValue = 'Search result';

describe('Search Results Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should have correct page title', () => {
    const pageTitle = htmlRes.title;
    expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
  });

  it('should display back button', () => {
    const backButton = htmlRes.getElementsByClassName(backLinkClass);
    expect(backButton[0].innerHTML).contains('Back', 'Back button does not contain correct text');
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
    const items = htmlRes.getElementsByClassName(rowClass).item(1).children;
    expect(items[0].innerHTML).contains('38543', 'URN does not exist');
    expect(items[1].innerHTML).contains('635356', 'Case number does not exist');
  });
});
