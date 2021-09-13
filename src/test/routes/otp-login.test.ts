import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';


describe('Otp Login', () => {
  describe('on GET', () => {
    test('should return otp-login page', async () => {
      await request(app)
        .get('/otp-login')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST 6 digits', () => {
    test('should return subscription management page', async () => {
      await request(app)
        .post('/otp-login')
        .send({'otp-code': '123456'})
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('subscription-management');
        });
    });
  });

  describe('on POST less than 6 digits', () => {
    test('should return otp-login page', async () => {
      await request(app)
        .post('/otp-login')
        .send({'otp-code': '12345'})
        .expect((res) => {
          expect(res.status).to.equal(200);
        });
    });
  });

});
