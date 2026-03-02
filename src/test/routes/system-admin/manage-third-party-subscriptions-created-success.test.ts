import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';

describe('Manage third party subscriptions created success', () => {
    describe('on GET', () => {
        app.request['user'] = {
            userId: '1',
            roles: 'SYSTEM_ADMIN',
        };

        test('should return manage third party subscriptions created success page', async () => {
            await request(app)
                .get('/manage-third-party-subscriptions-created-success')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
