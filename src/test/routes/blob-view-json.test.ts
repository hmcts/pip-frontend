import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Blob view JSON page', () => {
    describe('on GET', () => {
        test('should return blob-view-json page', async () => {
            app.request['user'] = {
                id: '1',
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .get('/blob-view-json')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
