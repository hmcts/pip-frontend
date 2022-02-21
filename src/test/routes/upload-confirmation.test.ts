import { expect } from 'chai';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';

const PAGE_URL = '/upload-confirmation';
sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Upload confirmation', () => {
  describe('on GET', () => {
    test('should return upload confirmation page', async () => {
      app.request['user'] = {id: '1'};
      await request(app).get(PAGE_URL).expect((res) => expect(res.status).to.equal(200));
    });
  });
});
