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

        test('should return error page when no user', async () => {
            expressRequest['user'] = {};
            await request(app)
                .get('/session-expired-logout')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('Sorry, there is a problem with the service'));
        });
    });
});
