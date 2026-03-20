import { expect } from 'chai';
import request from 'supertest';

import { app, appSetup } from '../../../main/app';

const robotsTxt = {
    message: 'User-agent: *\nDisallow: /',
};

describe('P&I frontend robots.txt check', () => {
    describe('on GET', () => {
        beforeAll(async () => {
            await appSetup();
        });

        test('should return a 200 status', async () => {
            await request(app)
                .get('/robots.txt')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return a rule to disallow crawl', async () => {
            await request(app)
                .get('/robots.txt')
                .expect(res => expect(res.text).to.equal(robotsTxt.message));
        });
    });
});
