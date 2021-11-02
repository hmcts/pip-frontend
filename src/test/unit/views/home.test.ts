import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';

const PAGE_URL = '/';
const headingClass = 'govuk-heading-xl';
const selectClass = 'govuk-select';
const startButtonClass = 'govuk-button govuk-button--start';
const expectedHeader = 'See publications and information from a court or tribunal';

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

  it('should display select menu',  () => {
    const select = htmlRes.getElementsByClassName(selectClass);
    expect(select[0].innerHTML).contains('My subscriptions', 'Could not find the select menu');
  });

  it('should display button start', () => {
    const button = htmlRes.getElementsByClassName(startButtonClass);
    expect(button[0].innerHTML).contains('Start now', 'Could not find the button');
  });
});
