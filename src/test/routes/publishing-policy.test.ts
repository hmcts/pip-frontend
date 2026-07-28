import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Publishing Policy Page', () => {
    describe('on GET', () => {
        test('should return publishing policy page', async () => {
            await request(app)
                .get('/publishing-policy')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
