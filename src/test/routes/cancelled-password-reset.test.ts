import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Cancelled password reset Page', () => {
    describe('on GET', () => {
        test('should return cancelled password reset page for media', async () => {
            await request(app)
                .get('/cancelled-password-reset/false')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return cancelled password reset page for admin', async () => {
            await request(app)
                .get('/cancelled-password-reset/true')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
