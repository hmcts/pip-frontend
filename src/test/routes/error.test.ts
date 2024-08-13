import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';

describe('Crime rejected login page', () => {
    describe('on GET', () => {
        test('should return crime-rejected-login page', async () => {
            await request(app)
                .get('/crime-rejected-login')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
