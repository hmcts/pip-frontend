import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';

describe('Error page', () => {
    describe('on GET', () => {
        test('should return error page', async () => {
            await request(app)
                .get('/error')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
