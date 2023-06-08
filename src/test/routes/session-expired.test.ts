import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

describe('Session expired', () => {
    describe('on GET', () => {
        test('should return session expired page', async () => {
            await request(app)
                .get('/session-expired?reSignInUrl=AAD')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contains('You have been signed out, due to inactivity'));
        });

        test('should return error page when an invalid re sign in url has been provided', async () => {
            await request(app)
                .get('/session-expired?reSignInUrl=NOT-VALID')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contains('Sorry, there is a problem with the service'));
        });
    });
});
