import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';

const PAGE_URL = '/admin-dashboard';
const cards = [
  {
    title: 'Upload file',
    description: 'JSON, PDF, DOC, CSV, HTM, or HTML files.',
    link: 'manual-upload',
  },
  {
    title: 'Remove content',
    description: 'JSON, PDF, DOC, CSV, HTM, or HTML files.',
    link: 'remove-list-search',
  },
  {
    title: 'Manage media account request',
    description: 'CTSC assess new media account applications.',
    link: 'manage-media-accounts',
  },
  {
    title: 'Create new account',
    description: 'Create accounts for: System Admin, CTSC Super Admin, Local Super Admin, CTSC Admin, Local Admin.',
    link: '#',
  },
];
let htmlRes: Document;

describe('Admin Dashboard page', () => {
  beforeAll(async () => {
    sinon.stub(expressRequest, 'isAuthenticated').returns(true);
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML)
      .contains('Admin Dashboard', 'Could not find correct value in header');
  });

  it('should display 3 card options', () => {
    const cardComponents = htmlRes.getElementsByClassName('account-card');
    expect(cardComponents.length).equal(cards.length);
  });

  it('cards should have correct content and links', () => {
    for(let i = 0; i < cards.length; i++) {
      const adminCards = htmlRes.getElementsByClassName('account-card');
      const link = adminCards[i].getElementsByTagName('a')[0];
      const description = adminCards[i].getElementsByTagName('p')[1];
      expect(link.innerHTML).contains(cards[i].title);
      expect(link.getAttribute('href')).contains(cards[i].link);
      expect(description.innerHTML).contains(cards[i].description);
    }
  });
});
