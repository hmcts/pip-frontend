import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

// TODO: replace this sample test with proper route tests for your application
describe('Not found page', () => {
  describe('on GET', () => {
    test('should return not found page', async () => {
      await request(app)
        .get('/not-found')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
