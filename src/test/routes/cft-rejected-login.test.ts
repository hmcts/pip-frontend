import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';

describe('CFT rejected login page', () => {
    describe('on GET', () => {
        test('should return cft-rejected-login page', async () => {
            await request(app)
                .get('/cft-rejected-login')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
