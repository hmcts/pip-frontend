import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';

const PAGE_URL = '/subscription-add-list-language';

describe('Subscriptions Config List Language', () => {
    describe('on GET', () => {
        test('should return subscription config list language page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should show subscription list type confirmation page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            app.request['body'] = { 'list-language': 'ENGLISH' };

            await request(app)
                .post(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(302);
                });
        });
    });
});
