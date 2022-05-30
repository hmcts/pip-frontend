import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('List option', () => {
  describe('on GET', () => {
    it('should return search option page', () => {
      app['user'] = {id:1};
      request(app)
        .get('/list-option?locationId=1')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
