import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import {request as expressRequest} from 'express';
const PAGE_URL = '/mock-session';

let htmlRes: Document;
describe('Mock-Session page - logged out', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display sign in button in header for a logged out user', () => {
    const header = htmlRes.getElementsByClassName('govuk-header__navigation govuk-header__navigation--end');
    expect(header[0].innerHTML).contains('Sign in', 'Could not find correct value in header');
  });
});

describe('Subscription add Page initial load', () => {
  beforeAll(async () => {
    sinon.stub(expressRequest, 'isAuthenticated').returns(true);

    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });
  it('should display sign out button in header for a logged in user', () => {
    const header = htmlRes.getElementsByClassName('govuk-header__navigation govuk-header__navigation--end');
    expect(header[0].innerHTML).contains('Sign out', 'Could not find correct value in header');
  });
});


// describe('Log out from page', () => {
//   beforeAll(async () => {
//
//     await request(app).get(PAGE_URL).then(res => {
//       htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
//     });
//   });
//   it('should display sign in button in header for a logged out user', () => {
//     const header = htmlRes.getElementsByClassName('govuk-header__navigation govuk-header__navigation--end');
//     // request(app).get('/logout');
//     expect(header[0].innerHTML).contains('Sign in', 'Could not find correct value in header');
//   });
// });

