import { app } from '../../../main/app';
import request from 'supertest';
import { expect } from 'chai';
const PAGE_URL = '/manage-list-types';

describe('Manage list types', () => {
    describe('on GET', () => {
        test('should return manage list types page', async () => {
            app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
