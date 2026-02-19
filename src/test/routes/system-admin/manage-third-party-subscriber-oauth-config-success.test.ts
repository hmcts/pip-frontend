import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Create third party subscriber oauth config success page', () => {
    describe('on GET', () => {
        test('should render create third party subscriber oauth config success page', async () => {
            await request(app)
                .get('/manage-third-party-subscriber-oauth-config-success')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
