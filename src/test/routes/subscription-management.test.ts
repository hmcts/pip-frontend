import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import {request as expressRequest} from "express";


describe('Subscription Management', () => {
  describe('on GET', () => {
    test('should return subscription-management page', async () => {

      sinon.stub(expressRequest, "isAuthenticated").returns(true);

      await request(app)
        .get('/subscription-management')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

});
