import { app } from '../../../main/app';
import { expect } from 'chai';
import request from 'supertest';

const PAGE_URL = '/view-option';
let htmlRes;
const NON_SIGNED_IN_LINKS = {
  Home: 'view-option',
  'Sign in': 'https://hmcts-sjp.herokuapp.com/sign-in.html',
};
const SIGNED_IN_LINKS = {
  Home: 'https://hmcts-sjp.herokuapp.com/account.html',
  Subscriptions: 'https://hmcts-sjp.herokuapp.com/add-subscription.html',
  'Sign out': 'logout',
};

describe('Navigation banner tests on the view-option page', () => {
  describe('Non signed in user', () => {
    beforeAll(async () => {
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display navigation banner with 2 links', () => {
      const navigationLinks = htmlRes.getElementsByClassName('moj-sub-navigation__item');
      expect(navigationLinks.length).to.equal(2);
    });

    it('links should have correct names and paths', () => {
      const linkKeys = Object.keys(NON_SIGNED_IN_LINKS);
      const navigationLinks = htmlRes.getElementsByClassName('moj-sub-navigation__item');
      linkKeys.forEach((value, index) => {
        const link = navigationLinks[index].getElementsByClassName('moj-sub-navigation__link')[0];
        expect(link.innerHTML).contain(value, 'link has incorrect name');
        expect(link.getAttribute('HREF')).contain(NON_SIGNED_IN_LINKS[value], 'link has incorrect path');
      });
    });
  });

  describe('Signed in user', () => {
    beforeAll(async () => {
      app.request['user'] = {id: '1'};
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display navigation banner with 3 links', () => {
      const navigationLinks = htmlRes.getElementsByClassName('moj-sub-navigation__item');
      expect(navigationLinks.length).to.equal(3);
    });

    it('links should have correct names and paths', () => {
      const signedInKeys = Object.keys(SIGNED_IN_LINKS);
      const signedInLinks = htmlRes.getElementsByClassName('moj-sub-navigation__item');
      signedInKeys.forEach((value, index) => {
        const link = signedInLinks[index].getElementsByClassName('moj-sub-navigation__link')[0];
        expect(link.innerHTML).contain(value, 'link has incorrect name');
        expect(link.getAttribute('HREF')).contain(SIGNED_IN_LINKS[value], 'link has incorrect path');
      });
    });
  });
});
