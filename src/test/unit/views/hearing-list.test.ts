import { expect } from 'chai';
import request from 'supertest';
import moment from 'moment';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {CourtRequests} from '../../../main/resources/requests/courtRequests';

const PAGE_URL = '/hearing-list?courtId=1';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const hearingsData = JSON.parse(rawData);

sinon.stub(CourtRequests.prototype, 'getCourt').returns(hearingsData[0]);

describe('Hearing List page', () => {
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

  it('should display court name header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains(' hearing list', 'Could not find the header');
  });

  it('should display table caption', () => {
    const tableHeader = htmlRes.getElementsByClassName('govuk-table__caption--m');
    const formattedDate = moment().format('MMMM DD YYYY');
    expect(tableHeader[0].innerHTML).contains('List for ' + formattedDate, 'Could not find the table header');
  });

  it('should contain expected column headings', () => {
    const columnHeadings = htmlRes.getElementsByClassName('govuk-table__header');
    expect(columnHeadings[0].innerHTML).contains('Court Number', 'Could not find court number header');
    expect(columnHeadings[1].innerHTML).contains('Case name', 'Could not find case name header');
    expect(columnHeadings[2].innerHTML).contains('Case number', 'Could not find court number header');
    expect(columnHeadings[3].innerHTML).contains('Overseen by', 'Could not find judges header');
    expect(columnHeadings[4].innerHTML).contains('Time', 'Could not find time header');
    expect(columnHeadings[5].innerHTML).contains('Hearing platform', 'Could not find hearing platform header');
  });

  it('should contain 4 rows, including the header', () => {
    const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
    expect(tableRows.length).equal(4, 'Number of rows is not equal to expected amount');
  });

  it('should contain a row with the correct values', () => {
    const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
    const items = tableRows.item(1).children;

    expect(items.item(0).innerHTML).contains('3', 'Court Number not found / correct');
    expect(items.item(1).innerHTML).contains("Roombo's hearings", 'Case name not found / correct');
    expect(items.item(2).innerHTML).contains('04-347-1750', 'Case number not found / correct');
    expect(items.item(3).innerHTML).contains('Tait Di Carlo', 'Judges not found / correct');
    expect(items.item(4).innerHTML).contains('08/09/2021 13:57:29', 'Time not found / correct');
    expect(items.item(5).innerHTML).contains('Zoom', 'Hearing Platform not found / correct');
  });

  it('should display the related content section', () => {
    const relatedContent = htmlRes.getElementsByClassName('govuk-heading-s');

    expect(relatedContent.item(0).innerHTML).contains('Related Content', 'Related Content header not present');
  });

  it('should display the link', () => {
    const link = htmlRes.getElementsByClassName('govuk-link');

    expect(link.item(0).innerHTML).contains('See another court or tribunal', 'Link text is not present');
    expect(link.item(0).getAttribute('href')).equal('/search-option', 'Link value is not correct');
  });

});
