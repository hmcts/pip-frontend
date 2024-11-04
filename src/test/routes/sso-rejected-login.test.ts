import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { ssoNotAuthorised } from '../../main/helpers/consts';

describe('SSO rejected login page', () => {
    describe('on GET', () => {
        test('should return sso-rejected-login page', async () => {
            expressRequest['session'] = { messages: [ssoNotAuthorised] };
            await request(app)
                .get('/sso-rejected-login')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('Unfortunately, you do not have an account'));
        });

        test('should not return sso-rejected-login page if not roles error', async () => {
            expressRequest['session'] = { messages: ['UNKNOWN_ERROR'] };
            await request(app)
                .get('/sso-rejected-login')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('Sorry, there is a problem with the service'));
        });
    });
});
