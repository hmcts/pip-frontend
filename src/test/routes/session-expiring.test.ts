import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';

describe('Session expiring', () => {
    describe('on GET', () => {
        test('should return session expiring page', async () => {
            expressRequest['user'] = { roles: 'VERIFIED' };
            await request(app)
                .get('/session-expiring')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('You will soon be signed out, due to inactivity'));
        });

        test('should return error page when no user', async () => {
            expressRequest['user'] = {};
            await request(app)
                .get('/session-expiring')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('Sorry, there is a problem with the service'));
        });
    });
});
