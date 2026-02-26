import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Case name search', () => {
    describe('on GET', () => {
        test('should return case name search results page', async () => {
            await request(app)
                .get('/case-name-search-results?search=alo')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Subscription case search results');
                });
        });
    });

    describe('on POST', () => {
        test('should redirect to pending subscription page', async () => {
            await request(app)
                .post('/case-name-search-results')
                .send({})
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.contain('pending-subscriptions');
                });
        });

        test('should render error page if no body provided', async () => {
            await request(app)
                .post('/case-name-search-results')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Sorry, there is a problem');
                });
        });
    });
});
