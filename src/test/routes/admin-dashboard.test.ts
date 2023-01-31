import { app } from '../../main/app';
import { expect } from 'chai';
import request from 'supertest';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Admin Dashboard Home', () => {
    describe('on GET', () => {
        test('should return admin dashboard page', async () => {
            await request(app)
                .get('/admin-dashboard')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
