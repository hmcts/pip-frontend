import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import { request as expressRequest } from 'express';

const PAGE_URL = '/remove-list-success';

expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

describe('Remove list success', () => {
    test('should return remove list success page', async () => {
        await request(app)
            .get(PAGE_URL)
            .expect(res => expect(res.status).to.equal(200));
    });
});
