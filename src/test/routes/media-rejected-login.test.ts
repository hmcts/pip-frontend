import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Media rejected login page', () => {
    describe('on GET', () => {
        test('should return media-rejected-login page', async () => {
            await request(app)
                .get('/media-rejected-login')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
