import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/sign-in';
const headingClass = 'govuk-fieldset__heading';
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';

const expectedHeader = 'How do you want to sign in?';
const expectedButtonText = 'Continue';
const expectedRadioLabel1 = 'With My HMCTS account';
const expectedRadioLabel2 = 'With Common Platform account';
const expectedRadioLabel3 = 'With a Court and tribunal hearings account';

let htmlRes: Document;
describe('Sign In option Page', () => {
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

  it('should display 3 radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons.length).equal(3, '3 radio buttons not found');
  });

  it('should display first radio button content',  () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[0].innerHTML).contains(expectedRadioLabel1, 'Could not find the radio button with label ' + expectedRadioLabel1);
  });

  it('should display second radio button content',  () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[1].innerHTML).contains(expectedRadioLabel2, 'Could not find the radio button with label ' + expectedRadioLabel2);
  });

  it('should display third radio button content',  () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[2].innerHTML).contains(expectedRadioLabel3, 'Could not find the radio button with label ' + expectedRadioLabel2);
  });

});
