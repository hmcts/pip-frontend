import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Status Description search', () => {
  describe('on GET', () => {
    test('should return status description page', () => {
      request(app)
        .get('/status-description')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
