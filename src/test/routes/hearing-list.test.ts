import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Hearing list', () => {
  describe('on GET', () => {
    test('should return search option page', async () => {
      await request(app)
        .get('/search-option?courtId=2')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
