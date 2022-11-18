import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';
import {request as expressRequest} from 'express';

const PAGE_URL = '/bulk-delete-subscriptions';
expressRequest['user'] = {'_json': {'extension_UserRole': 'VERIFIED'}};

describe('Bulk delete subscriptions', () => {
  describe('on GET', () => {
    test('should render bulk delete subscriptions page', async () => {
      await request(app)
        .get(PAGE_URL)
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should render bulk delete subscriptions page with \'all\' query parameter', async () => {
      await request(app)
        .get(PAGE_URL + '?all')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should render bulk delete subscriptions page with \'case\' query parameter', async () => {
      await request(app)
        .get(PAGE_URL + '?case')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should render bulk delete subscriptions page with \'court\' query parameter', async () => {
      await request(app)
        .get(PAGE_URL + '?court')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should render bulk delete subscriptions page if no subscription to delete', async () => {
      await request(app).post(PAGE_URL)
        .send({})
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should render bulk delete subscriptions confirmation page if there is a case subscription to delete', async () => {
      await request(app).post(PAGE_URL)
        .send({caseSubscription: '123'})
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should render bulk delete subscriptions confirmation page if there is a court subscription to delete', async () => {
      await request(app).post(PAGE_URL)
        .send({courtSubscription: '456'})
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should render bulk delete subscriptions confirmation page if there are both case and court subscriptions to delete', async () => {
      await request(app).post(PAGE_URL)
        .send({caseSubscription: '123', courtSubscription: '456'})
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
