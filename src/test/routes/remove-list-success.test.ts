import { expect } from 'chai';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';

const PAGE_URL = '/remove-list-success';
sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Remove list success', () => {
  test('should return remove list success page', async () => {
    await request(app).get(PAGE_URL).expect((res) => expect(res.status).to.equal(200));
  });
});
