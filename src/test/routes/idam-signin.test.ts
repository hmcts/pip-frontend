import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';


describe('idam signin page', () => {
  describe('on GET', () => {
    test('should return otp-login page', async () => {
      await request(app)
        .get('/idam-signin')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should return external page', async () => {
      await request(app)
        .post('/idam-signin')
        .send({'idam-select': 'cft'})
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('https://www.google.com');
        });
    });
  });

  describe('on POST', () => {
    test('should return external page', async () => {
      await request(app)
        .post('/idam-signin')
        .send({'idam-select': 'crime'})
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('https://www.google.com');
        });
    });
  });

});
