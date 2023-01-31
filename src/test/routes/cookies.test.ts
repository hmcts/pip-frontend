import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Cookies Page', () => {
    describe('on GET', () => {
        test('should return cookies page', async () => {
            await request(app)
                .get('/cookie-policy')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
