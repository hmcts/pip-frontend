import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Cancelled password reset Page', () => {
    describe('on GET', () => {
        test('should return cancelled password reset page', async () => {
            await request(app)
                .get('/cancelled-password-reset')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
