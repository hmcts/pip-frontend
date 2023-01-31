import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
const PAGE_URL = '/manual-reference-data-upload-confirmation';

describe('Reference data Upload confirmation', () => {
    describe('on GET', () => {
        test('should return upload confirmation page', async () => {
            app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
