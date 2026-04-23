import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';

const PAGE_URL = '/subscription-configure-list-language';

describe('Subscriptions Config List Language', () => {
    describe('on GET', () => {
        test('should return subscription config list language page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('What version of the list do you want to receive?');
                });
        });
    });

    describe('on POST', () => {
        test('should show subscription list preview page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };

            await request(app)
                .post(PAGE_URL)
                .send({ 'list-language': 'ENGLISH' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.headers['location']).to.equal('/subscription-configure-list-preview');
                });
        });

        test('should render error page when no language is provided', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };

            await request(app)
                .post(PAGE_URL)
                .send({})
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('What version of the list do you want to receive?');
                });
        });

        test('should render error page when no body is provided', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };

            await request(app)
                .post(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('What version of the list do you want to receive?');
                });
        });
    });
});
