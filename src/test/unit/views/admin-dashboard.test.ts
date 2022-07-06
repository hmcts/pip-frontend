import { app } from '../../../main/app';
import { expect } from 'chai';
import request from 'supertest';

const PAGE_URL = '/admin-dashboard';
const pageTitleValue = 'Staff dashboard';
const cards = [
  {
    title: 'Upload',
    description: 'Upload a file to be published on the external facing Court and tribunal hearings service.',
    link: 'manual-upload',
  },
  {
    title: 'Remove',
    description: 'Search by court or tribunal and remove a publication from the external facing Court and tribunal hearings service.',
    link: 'remove-list-search',
  },
  {
    title: 'Manage media account request',
    description: 'CTSC assess new media account applications.',
    link: 'media-applications',
  },
  {
    title: 'Create new account',
    description: 'Create accounts for: System Admin, CTSC Super Admin, Local Super Admin, CTSC Admin, Local Admin.',
    link: 'create-admin-account',
  },
];
let htmlRes: Document;

describe('Admin Dashboard page', () => {
  beforeAll(async () => {
    app.request['user'] = {piUserId: '1', _json: {
        'extension_UserRole': 'INTERNAL_ADMIN_CTSC'
      }};
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should have correct page title', () => {
    const pageTitle = htmlRes.title;
    expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
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
