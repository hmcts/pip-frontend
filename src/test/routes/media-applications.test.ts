import {request as expressRequest} from 'express';
import sinon from 'sinon';
import request from 'supertest';
import {app} from '../../main/app';
import {expect} from 'chai';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Media applications', () =>{
  describe('GET', () => {
    test('should return media applications page', async () => {
      await request(app)
        .get('/media-applications')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
