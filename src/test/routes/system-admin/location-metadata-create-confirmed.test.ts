import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/location-metadata-create-confirmed';
expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Location metadata create confirmed page', () => {
    describe('on GET', () => {
        test('should render location metadata create confirmed page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
