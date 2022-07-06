import request from 'supertest';
import {app} from '../../main/app';
import {expect} from 'chai';
import {request as expressRequest} from "express";

expressRequest['user'] = {'_json': {
    'extension_UserRole': 'INTERNAL_SUPER_ADMIN_CTSC'
}}

describe('Media applications', () =>{
  describe('GET', () => {
    test('should return media applications page', async () => {
      await request(app)
        .get('/media-applications')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
