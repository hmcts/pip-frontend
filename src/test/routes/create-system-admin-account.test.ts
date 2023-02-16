import { app } from '../../main/app';
import request from 'supertest';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

const mockData = {
    firstName: 'Joe',
    lastName: 'Bloggs',
    emailAddress: 'joe@bloggs.com',
};

describe('Create system admin account page', () => {
    describe('on GET', () => {
        test('should render admin account form', async () => {
            await request(app)
                .get('/create-system-admin-account')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should render admin account form with errors', async () => {
            await request(app)
                .post('/create-system-admin-account')
                .send({ firstName: 'Joe' })
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to admin account summary page', async () => {
            await request(app)
                .post('/create-system-admin-account')
                .send(mockData)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('create-system-admin-account-summary');
                });
        });
    });
});
