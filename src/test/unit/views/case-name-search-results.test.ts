import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import {PublicationRequests} from '../../../main/resources/requests/publicationRequests';

const PAGE_URL = '/case-name-search-results?search=Meedo';
const pageTitleValue = 'Search result';
let htmlRes: Document;

const data = [{
  search: {
    cases: [
      {caseName: "Meedoo's hearings", caseNumber: '123'},
      {caseName: "Meedoo's hearings", caseNumber: '321'},
      {caseName: "Meedoo's hearings", caseNumber: '234'},
      {caseName: "Meedoo's hearings", caseNumber: '534'},
      {caseName: "Meedoo's hearings", caseNumber: '674'},
    ],
  },
}];

sinon.stub(PublicationRequests.prototype, 'getPublicationByCaseValue').returns(data);

app.request['user'] = {'roles': 'VERIFIED'};

describe('Case name search results page', () => {
  beforeAll(async () => {

    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should have correct page title', () => {
    const pageTitle = htmlRes.title;
    expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
  });

  it('should display header', () => {
    const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(pageHeading[0].innerHTML).contains('Search result', 'Page heading does not exist');
  });

  it('should display results count message', () => {
    const resultsMessage = htmlRes.getElementsByClassName('govuk-body');
    expect(resultsMessage[0].innerHTML).contains('5  result(s) successfully found', 'Results message not found');
  });

  it('should contain expected column headings', () => {
    const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
    expect(tableHeaders[0].innerHTML).contains('Select a Result', 'Could not find select a result header');
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
