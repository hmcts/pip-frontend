import { expect } from 'chai';
import request from 'supertest';
// import moment from 'moment';

import { app } from '../../../main/app';

const PAGE_URL = '/live-status?courtId=1';
const expectedHeader = 'Live hearing updates - daily court list';
const exopectedCourtName = 'Mutsu Court';
let htmlRes: Document;

describe('Live Status page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display a back button with the correct value', () => {
    const backLink = htmlRes.getElementsByClassName('govuk-back-link');
    expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
    expect(backLink[0].getAttribute('href')).equal('#', 'Back value does not contain correct link');
  });

  it('should display correct header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
  });

  it('should display correct court name', () => {
    const courtName = htmlRes.getElementsByClassName('govuk-heading-m');
    expect(courtName[0].innerHTML).contains(exopectedCourtName, 'could not find the court name header');
  });

  it('should contain expected column headings', () => {
    const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
    expect(tableHeaders[0].innerHTML).contains('Court number', 'Could not find court number header');
    expect(tableHeaders[1].innerHTML).contains('Case number', 'Could not find case number header');
    expect(tableHeaders[2].innerHTML).contains('Case name', 'Could not find case name header');
    expect(tableHeaders[3].innerHTML).contains('Status', 'Could not find status header');
  });

  it('should contain 5 rows, including the header', () => {
    const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
    expect(tableRows.length).equal(5, 'Number of rows is not equal to expected amount');
  });

  it('should contain a row with the correct values', () => {
    const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
    const items = tableRows.item(1).children;
    const statusColumnValue = 'Committal for Sentence - <br><a class="govuk-link" href="status-description#2">Appeal Interpreter Sworn</a> - 12:25';

    expect(items.item(0).innerHTML).contains('1', 'Court Number not found / correct');
    expect(items.item(1).innerHTML).contains('T20217099', 'Case number not found / correct');
    expect(items.item(2).innerHTML).contains('Mills LLC\'s Hearing', 'Case name not found / correct');
    expect(items.item(3).innerHTML).contains(statusColumnValue, 'Status not found / correct');
  });

  it('should contain a row with no information', () => {
    const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
    const items = tableRows.item(2).children;

    expect(items.item(0).innerHTML).contains('', 'Court Number not found / correct');
    expect(items.item(1).innerHTML).contains('', 'Case number not found / correct');
    expect(items.item(2).innerHTML).contains('', 'Case name not found / correct');
    expect(items.item(3).innerHTML).contains('- No Information To Display', 'Status not found / correct');
  });


  it('should display the link to go back to court or tribunal list', () => {
    const link = htmlRes.getElementsByClassName('govuk-link');

    expect(link.item(3).innerHTML).contains('Find a court or tribunal list', 'Link text is not present');
    expect(link.item(3).getAttribute('href')).equal('/view-option', 'Link value is not correct');
  });
});
