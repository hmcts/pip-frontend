import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import request from 'supertest';

expressRequest['user'] = {
  _json: {
    extension_UserRole: 'VERIFIED',
  },
};

describe('Account Home', () => {
  describe('on GET', () => {
    test('should return account-home page', async () => {
      await request(app)
        .get('/account-home')
        .expect(res => expect(res.status).to.equal(200));
    });
  });
});
