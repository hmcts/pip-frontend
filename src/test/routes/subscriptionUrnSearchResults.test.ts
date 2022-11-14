import { expect } from 'chai';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import request from 'supertest';

expressRequest['user'] = {
  _json: {
    extension_UserRole: 'VERIFIED',
  },
};

describe('subscription URN Search result', () => {
  describe('on GET', () => {
    test('should return subscription Urn Search result page', async () => {
      await request(app)
        .get('/subscription-urn-search-results')
        .expect(res => expect(res.status).to.equal(200));
    });
  });
});
