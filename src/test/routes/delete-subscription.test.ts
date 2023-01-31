import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Delete Subscription', () => {
    describe('on GET', () => {
        test('should return delete subscription page if subscription query param is not provided', async () => {
            await request(app)
                .get('/delete-subscription')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return delete subscription page if subscription query param is provided', async () => {
            await request(app)
                .get('/delete-subscription?subscription=Foo')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
