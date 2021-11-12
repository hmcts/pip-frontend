import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/view-option';
const headingClass = 'govuk-fieldset__heading';
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';

const expectedHeader = 'What would you like to view?';
const expectedButtonText = 'Continue';
const expectedRadioLabel1 = 'Court or tribunal hearings';
const expectedRadioLabel2 = 'Live hearing updates - Crown Court only';
const expectedRadioLabel3 = 'Single Justice Procedure cases';
const expectedRadioHint3 = 'Cases involving adults charged with summary-only non-imprisonable offences, such as cases from Transport for London, TV Licensing, and the DVLA';

let htmlRes: Document;

describe('View Option Page', () => {
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
    expect(radioButtons[2].innerHTML).contains(expectedRadioLabel3, 'Could not find the radio button with label ' + expectedRadioLabel3);
  });

  it('should display third radio button hint',  () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[2].innerHTML).contains(expectedRadioHint3, 'Could not find the radio button with hint ' + expectedRadioHint3);
  });
});
