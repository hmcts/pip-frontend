import {expect} from 'chai';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import sinon from 'sinon';
import {app} from '../../../main/app';
import {CourtService} from '../../../main/service/courtService';
import {PublicationRequests} from '../../../main/resources/requests/publicationRequests';
import {UserService} from '../../../main/service/userService';

const PAGE_URL = '/summary-of-publications?courtId=0';
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/summaryOfPublications.json'), 'utf-8');
const pubs = JSON.parse(rawData);
let htmlRes: Document;

sinon.stub(PublicationRequests.prototype, 'getPublicationsByCourt').resolves(pubs);
sinon.stub(CourtService.prototype, 'getCourtById').resolves({'name': 'Court Name'});
sinon.stub(UserService.prototype, 'getPandIUserId').resolves('123');

describe('Publication Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains('What do you want to view from', 'Could not find correct value in header');
  });

  it('should display paragraph', () => {
    const items = htmlRes.getElementsByClassName('das-search-results__link');
    expect(items[0].innerHTML).contains('Single Justice Procedure Public List');
  });

  it('should display list date', () => {
    const items = htmlRes.getElementsByClassName('das-search-results__link');
    expect(items[0].innerHTML).contains('02 February 2022');
  });

  it('should return three items', () => {
    const items = htmlRes.getElementsByClassName('das-search-results__link').length;
    expect(items).equal(3);
  });

  it('should display a back button with the correct value', () => {
    const backLink = htmlRes.getElementsByClassName('govuk-back-link');
    expect(backLink[0].innerHTML)
      .contains('Back', 'Back button does not contain correct text');
    expect(backLink[0].getAttribute('href'))
      .equal('#', 'Back value does not contain correct link');
  });
});
