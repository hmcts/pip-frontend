import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Create third party subscriber page', () => {
    describe('on GET', () => {
        test('should render create third party subscriber page', async () => {
            await request(app)
                .get('/create-third-party-subscriber')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should render create third party subscriber page with errors', async () => {
            await request(app)
                .post('/create-third-party-subscriber')
                .send({})
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to create third party subscriber summary page', async () => {
            await request(app)
                .post('/create-third-party-subscriber')
                .send({ thirdPartySubscriberName: 'name' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/create-third-party-subscriber-summary');
                });
        });
    });
});
