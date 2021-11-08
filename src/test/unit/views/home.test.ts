import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';

const PAGE_URL = '/';
const headingClass = 'govuk-heading-xl';
const navigationClass = 'govuk-header__navigation-item';
const startButtonClass = 'govuk-button govuk-button--start';
const expectedHeader = 'See publications and information from a court or tribunal';
const govUkLinkClass = 'govuk-header__logo';
const expectedGovUkLink = 'https://www.gov.uk/';
const expectedServiceNameHeader = 'govuk-header__content';
const expectedServiceNameText = 'Courts and tribunal hearing information';

let htmlRes: Document;
describe('Home page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header',  () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
  });

  it('should have a link to gov.uk', () => {
    const govHeaderLink = htmlRes.getElementsByClassName(govUkLinkClass);
    expect(govHeaderLink[0].innerHTML).contains(expectedGovUkLink, 'Link was not accurate');
  });

  it('should have the correct service name text', () => {
    const serviceNameHeader = htmlRes.getElementsByClassName(expectedServiceNameHeader);
    expect(serviceNameHeader[0].innerHTML).contains(expectedServiceNameText, 'Text was not accurate');
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
