import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/media-account-approval-confirmation?applicantId=123';
expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

describe('Media account approval confirmation', () => {
    describe('on GET', () => {
        test('should render media account approval confirmation page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
