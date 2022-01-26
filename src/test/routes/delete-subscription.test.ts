import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

describe('Delete Subscription', () => {
  describe('on GET', () => {
    sinon.stub(expressRequest, 'isAuthenticated').returns(true);
    test('should return delete subscription page if subscription query param is not provided', async () => {
      await request(app).get('/delete-subscription')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return delete subscription page if subscription query param is provided', async () => {
      await request(app).get('/delete-subscription?subscription=Foo')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
