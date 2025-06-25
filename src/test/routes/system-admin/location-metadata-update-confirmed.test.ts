import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/location-metadata-update-confirmed';
expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Location metadata update confirmed page', () => {
    describe('on GET', () => {
        test('should render location metadata update confirmed page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
