import { expect } from 'chai';
import request from 'supertest';
import moment from 'moment';

import { app } from '../../../main/app';

const PAGE_URL = '/list?courtId=2';

let htmlRes: Document;

describe('List page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('Check that back button exists', () => {
    const header = htmlRes.getElementsByClassName('govuk-back-link');
    expect(header[0].innerHTML).contains('Back', 'Back button does not contain correct text');
    expect(header[0].getAttribute('href')).equal('/', 'Back value does not contain correct link');
  });

  it('Should display court name header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains('Khvalynsk Court hearing list', 'Could not find the header');
  });

  it('Should display table caption', () => {
    const header = htmlRes.getElementsByClassName('govuk-table__caption--m');
    const formattedDate = moment().format('MMMM DD YYYY');
    expect(header[0].innerHTML).contains('List for ' + formattedDate, 'Could not find the table header');
  });

  it('Should contain expected column headings', () => {
    const header = htmlRes.getElementsByClassName('govuk-table__header');
    expect(header[0].innerHTML).contains('Court Number', 'Could not find court number header');
    expect(header[1].innerHTML).contains('Case name', 'Could not find case name header');
    expect(header[2].innerHTML).contains('Case number', 'Could not find court number header');
    expect(header[3].innerHTML).contains('Judges', 'Could not find judges header');
    expect(header[4].innerHTML).contains('Time', 'Could not find time header');
    expect(header[5].innerHTML).contains('Hearing platform', 'Could not find hearing platform header');
  });

  it('Should contain 4 rows, including the header', () => {
    const rows = htmlRes.getElementsByClassName('govuk-table__row');
    expect(rows.length).equal(4, 'Number of rows is not equal to expected amount');
  });

  it('Row should contain the correct values', () => {
    const rows = htmlRes.getElementsByClassName('govuk-table__row');
    const items = rows.item(1).children;

    expect(items.item(0).innerHTML).contains('2', 'Court Number not found / correct');
    expect(items.item(1).innerHTML).contains('Wilkinson LLC\'s Hearing', 'Case name not found / correct');
    expect(items.item(2).innerHTML).contains('80-541-6372', 'Case number not found / correct');
    expect(items.item(3).innerHTML).contains('Judge Margarita Ivanonko', 'Judges not found / correct');
    expect(items.item(4).innerHTML).contains('4:46 PM', 'Time not found / correct');
    expect(items.item(5).innerHTML).contains('Microsoft Teams', 'Hearing Platform not found / correct');
  });

  it('Related content section found', () => {
    const relatedContent = htmlRes.getElementsByClassName('govuk-heading-s');

    expect(relatedContent.item(0).innerHTML).contains('Related Content', 'Related Content header not present');
  });

  it('Link found', () => {
    const relatedContent = htmlRes.getElementsByClassName('govuk-link');

    expect(relatedContent.item(0).innerHTML).contains('Find a court or tribunal list', 'Link text is not present');
    expect(relatedContent.item(0).getAttribute('href')).equal('/search-option', 'Link value is not correct');
  });

});
