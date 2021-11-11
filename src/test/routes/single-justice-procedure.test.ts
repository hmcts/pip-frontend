import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';

describe('Single Justice Procedure', () => {
  describe('on GET', () => {
    test('should return single-justice-procedure page', async () => {
      await request(app)
        .get('/single-justice-procedure')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
