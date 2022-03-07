import { app } from '../../main/app';
import { expect } from 'chai';
import {request as expressRequest} from 'express';
import request from 'supertest';
import sinon from 'sinon';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Admin Dashboard Home', () => {
  describe('on GET', () => {
    test('should return admin dashboard page', async () => {
      await request(app)
        .get('/admin-dashboard')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
