import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';

describe('Session expired logout', () => {
    describe('on GET', () => {
        test('should return session expired page', async () => {
            expressRequest['user'] = { roles: 'VERIFIED' };
            await request(app)
                .get('/session-expired-logout')
                .expect(res => expect(res.status).to.equal(302))
                .expect(res => expect(res.headers['location']).to.contain('/session-expired'));
        });

        test('should return session expired logout if no user', async () => {
            expressRequest['user'] = undefined;
            await request(app)
                .get('/session-expired-logout?redirectType=AAD')
                .expect(res => expect(res.status).to.equal(302))
                .expect(res => expect(res.headers['location']).to.contain('/session-expired?lng=en&reSignInUrl=AAD'));
        });

        test('should return session expired logout if no user or redirect type', async () => {
            expressRequest['user'] = undefined;
            await request(app)
                .get('/session-expired-logout')
                .expect(res => expect(res.status).to.equal(302))
                .expect(res => expect(res.headers['location']).to.contain('/session-logged-out?lng=en'));
        });
    });
});
