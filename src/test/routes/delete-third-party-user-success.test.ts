import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Delete third party user success page', () => {
    describe('on GET', () => {
        test('should render delete third party user success page', async () => {
            await request(app)
                .get('/delete-third-party-user-success')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
