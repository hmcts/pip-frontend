import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Case reference number search result', () => {
    describe('on GET', () => {
        test('should return Case reference number search result', async () => {
            await request(app)
                .get('/case-reference-number-search-results')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to pending subscription page', async () => {
            await request(app)
                .post('/pending-subscriptions')
                .expect(res => {
                    expect(res.status).to.equal(302);
                });
        });
    });
});
