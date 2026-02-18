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
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Select List Types');
                });
        });
    });

    describe('on POST', () => {
        test('should return subscription add list type language page', async () => {
            await request(app)
                .post('/subscription-add-list')
                .send({ 'list-selections[]': 'test' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.headers['location']).to.equal('subscription-add-list-language');
                });
        });

        test('should return subscription add list type page', async () => {
            await request(app)
                .post('/subscription-add-list')
                .send({})
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Select List Types');
                });
        });
    });
});
