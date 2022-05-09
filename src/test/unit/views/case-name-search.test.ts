import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import {PublicationRequests} from '../../../main/resources/requests/publicationRequests';

const PAGE_URL = '/case-name-search';
let htmlRes: Document;

sinon.stub(PublicationRequests.prototype, 'getPublicationByCaseValue').returns([]);

describe('Case name search page', () => {
  beforeAll(async () => {
    sinon.stub(expressRequest, 'isAuthenticated').returns(true);

    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display header', () => {
    const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(pageHeading[0].innerHTML).contains('What is the name of party or parties involved?', 'Page heading does not exist');
  });

  it('should display continue button',  () => {
    const buttons = htmlRes.getElementsByClassName('govuk-button');
    expect(buttons[0].innerHTML).contains('Continue', 'Could not find button');
  });

  it('should display blank input filed', () => {
    const inputField = htmlRes.getElementsByTagName('input');
    expect(inputField[0].value).contains('', 'Input should be blank');
  });

  it('should display appropriate label for input field', () => {
    const inputLabel = htmlRes.getElementsByTagName('label');
    expect(inputLabel[0].innerHTML).contains('For example, Toyota v John Smith.');
  });

  it('should not display error summary on the initial load', () => {
    const errorBox = htmlRes.getElementsByClassName('govuk-error-summary');
    expect(errorBox.length).equal(0, 'Error summary should not be displayed');
  });

  it('should not display input with error classes', () => {
    const inputError = htmlRes.getElementsByClassName('govuk-input--error');
    expect(inputError.length).equal(0, 'Input should not have error classes');
  });
});

describe('Case name search page with invalid input', () => {
  beforeAll(async () => {
    await request(app).post(PAGE_URL).send({'case-name': 'bob'}).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display error summary', () => {
    const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary');
    expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find error summary');
  });

  it('should display additional messages', () => {
    const additionalMessage = htmlRes.getElementsByClassName('govuk-heading-s');
    const improveResultsMessage = htmlRes.getElementsByClassName('govuk-body');
    expect(additionalMessage[0].innerHTML).contains('There are no matching results.', 'Could not find additional message');
    expect(improveResultsMessage[0].innerHTML).contains(
      'You can improve your results by double checking your spelling.',
      'Could not find improve results message');
  });

  it('should display input with error classes', () => {
    const inputError = htmlRes.getElementsByClassName('govuk-input--error');
    expect(inputError.length).equal(1, 'Input should have error classes');
  });

  it('should display input error message', () => {
    const inputError = htmlRes.getElementById('case-name-error');
    expect(inputError.innerHTML).contains('Please provide a correct case name', 'Input should have error classes');
  });
});
