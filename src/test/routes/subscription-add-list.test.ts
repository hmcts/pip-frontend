import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Subscriptions Add List Type', () => {
    describe('on GET', () => {
        test('should return subscription add list page', async () => {
            await request(app)
                .get('/subscription-add-list')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should return subscription add list type page', async () => {
            await request(app)
                .post('/subscription-add-list')
                .send({ 'list-selections[]': 'test' })
                .expect(res => expect(res.status).to.equal(302));
        });
    });
});
