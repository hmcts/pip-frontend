import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';

const PAGE_URL = '/subscription-urn-search';
const headingClass = 'govuk-label-wrapper';
const buttonClass = 'govuk-button';
const errorSummaryClass = 'govuk-error-summary';
const inputErrorClass = 'govuk-input--error';
const errorSummaryTitleClass = 'govuk-error-summary__title';
const errorSummaryBodyClass = 'govuk-error-summary__body';
const formErrorClass = 'govuk-form-group--error';
const expectedHeader = 'What is the unique reference number (URN)?';
const expectedButtonText = 'Continue';
const expectedErrorMessage = 'There is nothing matching your criteria';
const expectedErrorTitle = 'There is a problem';

let htmlRes: Document;

const stub = sinon.stub(PublicationService.prototype, 'getCaseByCaseUrn');
stub.withArgs('12345').returns(null);
stub.withArgs('').returns(null);

app.request['user'] = {
  _json: {
    extension_UserRole: 'VERIFIED',
  },
};

const pageTitleValue = 'Subscribe by unique reference number (URN)';

describe('URN Search Page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
      });
  });

  it('should have correct page title', () => {
    const pageTitle = htmlRes.title;
    expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
  });

  it('should display the header', () => {
    const header = htmlRes.getElementsByClassName(headingClass)[0].getElementsByClassName('govuk-label--l');
    expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
  });

  it('should display continue button', () => {
    const buttons = htmlRes.getElementsByClassName(buttonClass);
    expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
  });

  it('should display back button', () => {
    const backButton = htmlRes.getElementsByClassName('govuk-back-link');
    expect(backButton[0].innerHTML).contains('Back', 'Back button does not contain correct text');
  });

  it('should not display error summary on the initial load', () => {
    const errorBox = htmlRes.getElementsByClassName(errorSummaryClass);
    expect(errorBox.length).equal(0, 'Error summary should not be displayed');
  });

  it('should not display input with error classes', () => {
    const inputError = htmlRes.getElementsByClassName(inputErrorClass);
    expect(inputError.length).equal(0, 'Input should not have error classes');
  });
});

describe('URN Search Page Blank Input', () => {
  beforeAll(async () => {
    await request(app)
      .post(PAGE_URL)
      .send({ 'search-input': '' })
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
      });
  });

  it('should display minimum input error message', () => {
    const errorSummary = htmlRes.getElementsByClassName(errorSummaryBodyClass);
    expect(errorSummary[0].innerHTML).contains(expectedErrorMessage, 'Could not find error message');
  });

  it('should display error message', () => {
    const errorTitle = htmlRes.getElementsByClassName(errorSummaryTitleClass);
    expect(errorTitle[0].innerHTML).contains(expectedErrorTitle, 'Could not find title');
  });

  it('should display input errors', () => {
    const formError = htmlRes.getElementsByClassName(formErrorClass);
    expect(formError.length).equal(1, 'Could not find form errors');
  });
});

describe('URN Search Page Invalid Input', () => {
  beforeAll(async () => {
    await request(app)
      .post(PAGE_URL)
      .send({ 'search-input': '12345' })
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
      });
  });

  it('should display minimum input error message', () => {
    const errorSummary = htmlRes.getElementsByClassName(errorSummaryBodyClass);
    expect(errorSummary[0].innerHTML).contains(expectedErrorMessage, 'Could not find error message');
  });

  it('should display error message', () => {
    const errorTitle = htmlRes.getElementsByClassName(errorSummaryTitleClass);
    expect(errorTitle[0].innerHTML).contains(expectedErrorTitle, 'Could not find error title');
  });

  it('should display input errors', () => {
    const formError = htmlRes.getElementsByClassName(formErrorClass);
    expect(formError.length).equal(1, 'Could not find form errors');
  });
});
