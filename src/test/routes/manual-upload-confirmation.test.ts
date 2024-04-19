import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
const PAGE_URL = '/manual-upload-confirmation';

describe('Manual upload confirmation', () => {
    describe('on GET', () => {
        test('should return upload confirmation page', async () => {
            app.request['user'] = { roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
