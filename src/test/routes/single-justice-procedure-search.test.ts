import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';

describe('Single Justice Procedure Search', () => {
  describe('on GET', () => {
    test('should return single-justice-procedure-search page', async () => {
      await request(app)
        .get('/single-justice-procedure-search')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
