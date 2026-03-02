import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';

describe('Manage third party subscriptions updated success', () => {
    describe('on GET', () => {
        app.request['user'] = {
            userId: '1',
            roles: 'SYSTEM_ADMIN',
        };

        test('should return manage third party subscriptions updated success page', async () => {
            await request(app)
                .get('/manage-third-party-subscriptions-updated-success')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
