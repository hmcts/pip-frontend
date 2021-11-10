import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';
import {request as expressRequest} from 'express';
import sinon from 'sinon';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Standard List', () => {
  describe('on GET', () => {
    test('should return standard list page', async () => {
      await request(app)
        .get('/standard-list?courtId=10')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

});
