import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Not found page', () => {
    describe('on GET', () => {
        test('should return not found page', async () => {
            await request(app)
                .get('/not-found')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return not found page', async () => {
            await request(app)
                .get('/not-a-real-page')
                .expect(res => expect(res.status).to.equal(404));
        });
    });
});
