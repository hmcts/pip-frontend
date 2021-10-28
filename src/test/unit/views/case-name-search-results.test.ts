import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { HearingRequests } from '../../../main/resources/requests/hearingRequests';

const PAGE_URL = '/case-name-search-results?search=Meedo';
let htmlRes: Document;

const data = [
  {caseName: "Meedoo's hearings", caseNumber: ''},
  {caseName: "Meedoo's hearings", caseNumber: ''},
  {caseName: "Meedoo's hearings", caseNumber: ''},
  {caseName: "Meedoo's hearings", caseNumber: ''},
  {caseName: "Meedoo's hearings", caseNumber: ''},
];

sinon.stub(HearingRequests.prototype, 'getHearingsByCaseName').withArgs('Meedo').returns(data);

describe('Case name search results page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(pageHeading[0].innerHTML).contains('Search result', 'Page heading does not exist');
  });

  it('should display results count message', () => {
    const resultsMessage = htmlRes.getElementsByClassName('govuk-body');
    expect(resultsMessage[0].innerHTML).contains('5  results successfully found', 'Results message not found');
  });

  it('should contain expected column headings', () => {
    const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
    expect(tableHeaders[1].innerHTML).contains('Case Name', 'Could not find case name header');
    expect(tableHeaders[2].innerHTML).contains('Reference Number', 'Could not find case reference number header');
  });

  it('should contain 6 rows, including the header', () => {
    const tableRows = htmlRes.getElementsByClassName('govuk-table__row');
    expect(tableRows.length).equal(6, 'Number of rows is not equal to expected amount');
  });

  it('should display checkboxes', () => {
    const checkBoxes = htmlRes.querySelectorAll('.govuk-table__body .govuk-checkboxes__input');
    expect(checkBoxes.length).equal(5, 'Could not find table checkboxes');
  });
});
