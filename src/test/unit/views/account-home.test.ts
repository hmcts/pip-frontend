import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';

const PAGE_URL = '/account-home';
const expectedCards = 4;
const cards = [
  {
    title: 'Court or tribunal publications',
    description: 'For example, list of hearings due to be heard, either today or in the future.',
    link: 'search',
  },
  {
    title: 'Live hearing updates',
    description: 'Find out the live status of hearings currently happening - Crown Court cases only.',
    link: 'live-case-alphabet-search',
  },
  {
    title: 'Single Justice Procedure cases',
    description: 'A nationwide list of cases, ready to be decided by a magistrate without a hearing. Such as TV licensing prosecutions.',
    link: 'single-justice-procedure',
  },
  {
    title: 'Subscriptions',
    description: 'Subscribe to receive court or tribunal publications by email and manage your existing subscriptions.',
    link: 'subscription-management',
  }];
let htmlRes: Document;

describe('Your Account page', () => {
  beforeAll(async () => {
    sinon.stub(expressRequest, 'isAuthenticated').returns(true);
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML)
      .contains('Your account', 'Could not find correct value in header');
  });

  it('should display 4 card options', () => {
    const cards = htmlRes.getElementsByClassName('account-card');
    expect(cards.length).equal(expectedCards);
  });

  it('cards should have correct content and links', () => {
    for(let i = 0; i < expectedCards; i++) {
      const accountCards = htmlRes.getElementsByClassName('account-card');
      const link = accountCards[i].getElementsByTagName('a')[0];
      const description = accountCards[i].getElementsByTagName('p')[1];
      expect(link.innerHTML).contains(cards[i].title);
      expect(link.getAttribute('href')).contains(cards[i].link);
      expect(description.innerHTML).contains(cards[i].description);
    }
  });
});
