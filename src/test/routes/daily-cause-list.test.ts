import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Daily Cause List Page', () => {
  describe('on GET', () => {
    test('should return daily cause list page', () => {
      request(app)
        .get('/daily-cause-list')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
