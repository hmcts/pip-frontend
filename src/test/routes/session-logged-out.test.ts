import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

describe('Session logged out', () => {
    describe('on GET', () => {
        test('should return session logged out page', async () => {
            await request(app)
                .get('/session-logged-out')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
