import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import { request as expressRequest } from 'express';

const PAGE_URL = '/delete-court-reference-data-success?locationId=1';

expressRequest['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };

describe('Deletion court success', () => {
    test('should return delete court success page', async () => {
        await request(app)
            .get(PAGE_URL)
            .expect(res => expect(res.status).to.equal(200));
    });
});
