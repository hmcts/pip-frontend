import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { SjpRequests } from '../../../main/resources/requests/sjpRequests';

const PAGE_URL = '/single-justice-procedure';
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawData).results;
const validOffence = 'Keep a vehicle without a valid vehicle licence';
const validProsecutor = 'Driver and Vehicle Licensing Agency';

let htmlRes: Document;

sinon.stub(SjpRequests.prototype, 'getSJPCases').returns(sjpCases);

describe('Single Justice Procedure Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains('Single Justice Procedure cases', 'Could not find correct value in header');
  });

  it('should display paragraph', () => {
    const paragraph = htmlRes.getElementsByClassName('govuk-body');
    expect(paragraph[0].innerHTML).contains('Cases involving adults charged with summary-only non-imprisonable offences.',
      'Could not find the table header');
  });

  it('should contain expected column headings', () => {
    const columnHeadings = htmlRes.getElementsByClassName('govuk-table__header');
    expect(columnHeadings[0].innerHTML).contains('Name', 'Could not find name header');
    expect(columnHeadings[1].innerHTML).contains('Town', 'Could not find town header');
    expect(columnHeadings[2].innerHTML).contains('County', 'Could not find county header');
    expect(columnHeadings[3].innerHTML).contains('Postcode', 'Could not find postcode header');
    expect(columnHeadings[4].innerHTML).contains('Offence', 'Could not find offence header');
    expect(columnHeadings[5].innerHTML).contains('Prosecutor', 'Could not find prosecutor header');
  });

  it('should contain 8 rows, including the header', () => {
    const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
    expect(tableRows.length).equal(8, 'Number of rows is not equal to expected amount');
  });

  it('should contain a row with the correct values', () => {
    const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
    const items = tableRows.item(1).children;

    expect(items.item(0).innerHTML).contains('A Morley', 'Name not found / correct');
    expect(items.item(1).innerHTML).contains('Aberdeen', 'Town not found / correct');
    expect(items.item(2).innerHTML).contains('', 'County not found / correct');
    expect(items.item(3).innerHTML).contains('AB', 'Postcode not found / correct');
    expect(items.item(4).innerHTML).contains(validOffence, 'Offence not found / correct');
    expect(items.item(5).innerHTML).contains(validProsecutor, 'Prosecutor not found / correct');
  });

  it('should display a back button with the correct value', () => {
    const backLink = htmlRes.getElementsByClassName('govuk-back-link');
    expect(backLink[0].innerHTML)
      .contains('Back', 'Back button does not contain correct text');
    expect(backLink[0].getAttribute('href'))
      .equal('#', 'Back value does not contain correct link');
  });
});
