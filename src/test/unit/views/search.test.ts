import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/search';
const headingClass = 'govuk-label-wrapper';
const buttonClass = 'govuk-button';
const errorSummaryClass = 'govuk-error-summary';
const inputErrorClass = 'govuk-input--error';
const errorSummaryTitleClass = 'govuk-error-summary__title';
const errorSummaryBodyClass = 'govuk-error-summary__body';
const formErrorClass = 'govuk-form-group--error';
const additionalMessageClass = 'govuk-heading-s';

const expectedHeader = 'What court or tribunal are you interested in?';
const expectedButtonText = 'Continue';

let htmlRes: Document;

describe('Search Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header',  () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
  });

  it('should display continue button',  () => {
    const buttons = htmlRes.getElementsByClassName(buttonClass);
    expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
  });

  it('should use accessible autocomplete in script', () => {
    const script = htmlRes.getElementsByTagName('script')[2];
    expect(script.innerHTML).contains('accessibleAutocomplete');
  });

  it('should fill source with court names', () => {
    const script = htmlRes.getElementsByTagName('script')[2];
    expect(script.innerHTML).contains('Mutsu Court', 'Could not find input field');
  });

  it('should display back button', () => {
    const backButton = htmlRes.getElementsByClassName('govuk-back-link');
    expect(backButton[0].innerHTML).contains('Back', 'Back button does not contain correct text');
    expect(backButton[0].getAttribute('href')).equal('/search-option', 'Back button does not contain correct link');
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

describe('Search Page Blank Input', () => {
  beforeAll(async () => {
    await request(app).post(PAGE_URL).send({'input-autocomplete': ''}).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display minimum input error message', () => {
    const errorSummary = htmlRes.getElementsByClassName(errorSummaryBodyClass);
    expect(errorSummary[0].innerHTML).contains('Search must be three characters or more', 'Could not find error message');
  });

  it('should display error message', () => {
    const errorTitle = htmlRes.getElementsByClassName(errorSummaryTitleClass);
    expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find title');
  });

  it('should display input errors', () => {
    const formError = htmlRes.getElementsByClassName(formErrorClass);
    expect(formError.length).equal(1, 'Could not find form errors');
  });
});

describe('Search Page Invalid Input', () => {
  beforeAll(async () => {
    await request(app).post(PAGE_URL).send({'input-autocomplete': 'foo'}).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display minimum input error message', () => {
    const errorSummary = htmlRes.getElementsByClassName(errorSummaryBodyClass);
    expect(errorSummary[0].innerHTML).contains('There is nothing matching your criteria', 'Could not find error message');
  });

  it('should display error message', () => {
    const errorTitle = htmlRes.getElementsByClassName(errorSummaryTitleClass);
    expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find error title');
  });

  it('should display input errors', () => {
    const formError = htmlRes.getElementsByClassName(formErrorClass);
    expect(formError.length).equal(1, 'Could not find form errors');
  });

  it('should display additional message', () => {
    const additionalMessage = htmlRes.getElementsByClassName(additionalMessageClass);
    expect(additionalMessage[0].innerHTML).contains('There are no matching results.', 'Could not find additional message');
  });
});

