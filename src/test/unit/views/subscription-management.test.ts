import {expect} from 'chai';
import request from 'supertest';
import { request as expressRequest } from 'express';
import sinon from 'sinon';

import {app} from '../../../main/app';

const PAGE_URL = '/subscription-management';

let htmlRes: Document;

describe('Subscription Management Page', () => {
  beforeAll(async () => {

    sinon.stub(expressRequest, "isAuthenticated").returns(true);

    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains('Subscription Management', 'Could not find correct value in header');
  });
});
