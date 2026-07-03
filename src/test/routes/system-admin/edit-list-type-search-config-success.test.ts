import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Edit list type search config success page', () => {
    describe('on GET', () => {
        test('should render edit list type search config success page', async () => {
            await request(app)
                .get('/edit-list-type-search-config-success')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
