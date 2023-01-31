import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/bulk-create-media-accounts-confirmed';
expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Bulk create media accounts confirmed', () => {
    describe('on GET', () => {
        test('should render bulk create media accounts confirmed page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
