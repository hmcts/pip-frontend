import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Accessibility Statement Page', () => {
    describe('on GET', () => {
        test('should return accessibility statement page', async () => {
            await request(app)
                .get('/accessibility-statement')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
