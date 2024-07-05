import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../main/resources/requests/AccountManagementRequests';
import { v4 as uuidv4 } from 'uuid';

const PAGE_URL = '/delete-user-confirmation';
const validUUID1 = uuidv4();
const validUUID2 = uuidv4();
const validUUID3 = uuidv4();

const stub = sinon.stub(AccountManagementRequests.prototype, 'deleteUser');
const validBody = { 'delete-user-confirm': 'yes', user: validUUID1 };
const invalidBody = { 'delete-user-confirm': 'yes', user: validUUID2 };
const redirectBody = { 'delete-user-confirm': 'no', user: validUUID3 };

describe('Delete User Confirmation', () => {
    beforeEach(() => {
        stub.withArgs(validUUID1).resolves(true);
        stub.withArgs(validUUID2).resolves(undefined);
        app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
    });

    describe('on POST', () => {
        test('should redirect to manage user if delete-user-confirm value is no', async () => {
            await request(app)
                .post(PAGE_URL)
                .send(redirectBody)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/manage-user?id=' + validUUID3);
                });
        });

        test('should render error page if invalid body data', async () => {
            await request(app)
                .post(PAGE_URL)
                .send(invalidBody)
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });

        test('should render the page if body is valid', async () => {
            await request(app)
                .post(PAGE_URL)
                .send(validBody)
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });
    });

    describe('on GET', () => {
        test('should render not found page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(404);
                });
        });
    });
});
