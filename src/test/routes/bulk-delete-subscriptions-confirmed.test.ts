import request from 'supertest';
import {app} from '../../main/app';
import {expect} from 'chai';
import {request as expressRequest} from 'express';

const PAGE_URL = '/bulk-delete-subscriptions-confirmed';
expressRequest['user'] = {'_json': {'extension_UserRole': 'VERIFIED'}};

describe('Bulk delete subscriptions confirmed', () => {
  describe('on GET', () => {
    test('should render bulk delete subscriptions confirmed page', async () => {
      await request(app)
        .get(PAGE_URL)
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
