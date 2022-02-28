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
    title: 'Manage Media accounts',
    description: 'Assess, approve, and reject new media account requests.',
    link: 'manage-media-accounts',
  },
  {
    title: 'Create New Administrator Account',
    unorderedList: 'Create:',
    listItems: ['System Admin', 'Super Admin CTSC', 'Super Admin Local', 'Admin CTSC', 'Admin Local'],
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
      // ignore last element as it doesn't have description
      if (i !== cards.length -1) {
        expect(description.innerHTML).contains(cards[i].description);
      }
    }
  });

  it('last card should contain unordered list with 5 list items', () => {
    const lastElement = cards.length - 1;
    const listItems = htmlRes.getElementsByClassName('account-card')[lastElement]
      .getElementsByClassName('govuk-list--bullet')[0];
    const elementsCount = listItems.getElementsByTagName('li').length;
    expect(elementsCount).equal(5);
    expect(listItems.innerHTML).contains('Create:');
    for (let j = 0; j < elementsCount; j++) {
      expect(listItems.getElementsByTagName('li')[j].innerHTML).contains(cards[lastElement].listItems[j]);
    }
  });
});
