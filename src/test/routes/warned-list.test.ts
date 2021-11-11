import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Warned list', () => {
  describe('on GET', () => {
    test('should return warned list page', async () => {
      app['user'] = {id:1};
      await request(app)
        .get('/warned-list')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
