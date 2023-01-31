import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/bulk-unsubscribe-confirmed';
expressRequest['user'] = { roles: 'VERIFIED' };

describe('Bulk unsubscribe confirmed', () => {
    describe('on GET', () => {
        test('should render bulk unsubscribe confirmed page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
