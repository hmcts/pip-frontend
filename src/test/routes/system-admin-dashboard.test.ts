import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import request from 'supertest';

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Account Home', () => {
    describe('on GET', () => {
        test('should return system admin dashboard page', async () => {
            await request(app)
                .get('/system-admin-dashboard')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
