import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Alphabetical search', () => {
  describe('on GET', () => {
    test('should return search option page', () => {
      request(app)
        .get('/alphabetical-search')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
