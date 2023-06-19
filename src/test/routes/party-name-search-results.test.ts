import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Party name search results', () => {
    describe('on GET', () => {
        test('should return party name search results page', async () => {
            await request(app)
                .get('/party-name-search-results?search=party')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
