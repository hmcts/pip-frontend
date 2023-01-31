import { expect } from 'chai';
import { app } from '../../main/app';

import request from 'supertest';

app.request['user'] = { roles: 'VERIFIED' };

describe('subscription Confirmation', () => {
    describe('on GET', () => {
        test('should return subscription confirmation page', async () => {
            await request(app)
                .get('/pending-subscriptions')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return pending subscriptions page with no-subscriptions query param', async () => {
            await request(app)
                .get('/pending-subscriptions?no-subscription=true')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should return subscription confirmation page', async () => {
            await request(app)
                .post('/pending-subscriptions')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
