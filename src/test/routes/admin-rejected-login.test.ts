import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Admin rejected login page', () => {
    describe('on GET', () => {
        test('should return admin-rejected-login page', async () => {
            await request(app)
                .get('/admin-rejected-login')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
