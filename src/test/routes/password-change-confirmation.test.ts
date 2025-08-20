import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Password Change Confirmation Page', () => {
    describe('on GET', () => {
        test('should return password-change-confirmation page', async () => {
            await request(app)
                .post('/password-change-confirmation')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect if the user cancels the password reset', async () => {
            await request(app)
                .post('/password-change-confirmation')
                .send({ error_description: 'AADB2C90091' })
                .expect(res => expect(res.redirect).to.be.true)
                .expect(res => expect(res.header.location).to.equal('/cancelled-password-reset'));
        });
    });
});
