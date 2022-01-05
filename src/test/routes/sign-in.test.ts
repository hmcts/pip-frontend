import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';


describe('Sign In option', () => {
  describe('on GET', () => {
    test('should return sign-in routing page', async () => {
      await request(app)
        .get('/sign-in')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
