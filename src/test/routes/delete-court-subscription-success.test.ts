import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import { request as expressRequest } from 'express';

const PAGE_URL = '/delete-court-subscription-success';

expressRequest['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };

describe('Deletion court subscription success', () => {
    test('should return delete court subscription success page', async () => {
        await request(app)
            .get(PAGE_URL)
            .expect(res => expect(res.status).to.equal(200));
    });
});
