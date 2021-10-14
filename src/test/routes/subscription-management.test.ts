import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';


describe('Subscription Management', () => {
  describe('on GET', () => {
    test('should return subscription-management page', async () => {
      await request(app)
        .get('/subscription-management')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on GET', () => {
    test('should return subscription-management page', async () => {
      await request(app)
        .get('/subscription-management?all')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on GET', () => {
    test('should return subscription-management page', async () => {
      await request(app)
        .get('/subscription-management?case')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on GET', () => {
    test('should return subscription-management page', async () => {
      await request(app)
        .get('/subscription-management?court')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
