import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Subscriptions Add List Language', () => {
    describe('on GET', () => {
        test('should return subscription add list language page', async () => {
            await request(app)
                .get('/subscription-add-list-language')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
