import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';

const PAGE_URL = '/';
const headingClass = 'gem-c-title__text govuk-heading-l';
const startLinkClass = 'govspeak';
const expectedHeader = 'HMCTS hearing lists';
const govUkLinkClass = 'govuk-header__logo';
const expectedGovUkLink = 'https://www.gov.uk/';
const expectedServiceNameHeader = 'govuk-header__content';
const expectedServiceNameText = 'Court and tribunal hearings';

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

  it('should display button start', () => {
    const button = htmlRes.getElementsByClassName(startLinkClass);
    expect(button[0].innerHTML).contains('Court and tribunal hearings', 'Could not find the button');
  });
});
