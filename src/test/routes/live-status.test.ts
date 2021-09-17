import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Live Status', () => {
  describe('on GET', () => {
    test('should return live status page', async () => {
      await request(app)
        .get('/live-status?courtId=26')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
