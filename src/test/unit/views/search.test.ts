import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/search';
const headingClass = 'govuk-label-wrapper';
const buttonClass = 'govuk-button';

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
});
