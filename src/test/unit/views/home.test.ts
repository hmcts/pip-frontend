import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/';
const headingClass = 'govuk-heading-xl';
const navigationClass = 'govuk-header__navigation-item';
const startButtonClass = 'govuk-button govuk-button--start';

let htmlRes: Document;
describe('Home page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header',  () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains('Find a court or tribunal listing', 'Could not find the header');
  });

  it('should display navigation menu',  () => {
    const nav = htmlRes.getElementsByClassName(navigationClass);
    expect(nav[0].innerHTML).contains('Subscriptions', 'Could not find the navigation bar');
  });

  it('should display button start', () => {
    const button = htmlRes.getElementsByClassName(startButtonClass);
    expect(button[0].innerHTML).contains('Start now', 'Could not find the button');
  });
});
