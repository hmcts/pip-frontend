import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/download-mi-report';
expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Download MI report page', () => {
    describe('on GET', () => {
        test('should render download MI report page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should download MI report', async () => {
            await request(app)
                .post(PAGE_URL)
                .send({
                    reportType: 'USER_ACCOUNTS',
                })
                .expect(200)
                .expect('Content-Type', /text\/csv/)
                .expect('Content-Disposition', /attachment/);
        });
    });
});
