import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/search-option';
const headingClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';

let htmlRes: Document;
describe('Search option Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header',  () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains('Find a court or tribunal listing', 'Could not find the header');
  });

  it('should display continue button',  () => {
    const buttons = htmlRes.getElementsByClassName(buttonClass);
    expect(buttons[0].innerHTML).contains('Continue', 'Could not find button');
  });

  it('should display 2 radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons.length).equal(2, '2 radio buttons not found');
  });

  it('should display first radio button content',  () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[0].innerHTML).contains('Search for a court or tribunal', 'Could not find the radio button');
  });

  it('should display second radio button content',  () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[1].innerHTML).contains('Find a court or tribunal alphabetically', 'Could not find the radio button');
  });
});
