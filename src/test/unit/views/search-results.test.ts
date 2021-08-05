import {expect} from 'chai';
import request from 'supertest';

import {app} from '../../../main/app';

const PAGE_URL = '/search-results';
const searchTerm = 'Aylesbury';
const numOfResults = '2';

const rowClass = 'govuk-table__row';

let htmlRes: Document;

describe('Search Results Page', () => {
  beforeAll(async () => {
    const payload = {'search-input': searchTerm};
    await request(app).get(PAGE_URL).send(payload).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display back button', () => {
    const backButton = htmlRes.getElementsByClassName('govuk-back-link');
    expect(backButton[0].innerHTML).contains('Back', 'Back button does not contain correct text');
    expect(backButton[0].getAttribute('href')).equal('/search-option', 'Back button does not contain correct link');
  });

  it('should display search term in header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains(searchTerm, 'Could not find search term in header');
  });

  it('should list the number of results found', () => {
    const bodyText = htmlRes.getElementsByClassName('govuk-body');
    expect(bodyText[0].innerHTML).contains(numOfResults, `Could not find ${numOfResults} results in the body`);
  });

  it('should display first table header', () => {
    const tableHeader1 = htmlRes.getElementsByClassName('govuk-table__header');
    expect(tableHeader1[0].innerHTML).contains('Court or tribunal', 'Could not find text in first header');
  });

  it('should display second table header', () => {
    const tableHeader2 = htmlRes.getElementsByClassName('govuk-table__header--numeric');
    expect(tableHeader2[0].innerHTML).contains('Number of hearings', 'Could not find text in second header');
  });

  it('should contain 3 rows including the header row', () => {
    const rows = htmlRes.getElementsByClassName(rowClass);
    expect(rows.length).equal(3, 'Table did not contain expected number of rows');
  });

  it('should contain rows with correct values', () => {
    const rows = htmlRes.getElementsByClassName(rowClass);
    const items = rows.item(1).children;

    expect(items[0].innerHTML).contains('Aylesbury Crown Court', 'First court not listed correctly');
    expect(items[1].innerHTML).contains('8', 'First court has incorrect number of hearings');
  });

  it('should contain correct link in search result', () => {
    const rows = htmlRes.getElementsByClassName(rowClass);
    const items = rows.item(1).children;

    expect(items[0].children[0].getAttribute('href')).equal('/hearing-list?courtId=34', 'First court not listed correctly');
  });
});
