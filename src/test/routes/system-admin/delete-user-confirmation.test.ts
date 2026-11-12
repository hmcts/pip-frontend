import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { v4 as uuidv4 } from 'uuid';

const PAGE_URL = '/delete-user-confirmation';
const validId1 = uuidv4();
const validId2 = uuidv4();

const userData = {
    email: 'test@email.com',
    roles: 'SYSTEM_ADMIN',
};

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves(userData);
const stub = sinon.stub(AccountManagementRequests.prototype, 'deleteUser');

describe('Delete User Confirmation', () => {
    beforeEach(() => {
        stub.withArgs(validId1).resolves(true);
        stub.withArgs(validId2).resolves(undefined);
        app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
    });

    describe('on GET', () => {
        test('should return delete user page', async () => {
            app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL + `?id=${validId1}`)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to delete-user-success if delete-user-confirm value is yes', async () => {
            await request(app)
                .post(PAGE_URL + `?id=${validId1}`)
                .send({ 'delete-user-confirm': 'yes' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/delete-user-success');
                });
        });

        test('should redirect to manage user if delete-user-confirm value is no', async () => {
            await request(app)
                .post(PAGE_URL + `?id=${validId1}`)
                .send({ 'delete-user-confirm': 'no' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/manage-user?id=' + validId1);
                });
        });

        test('should render error page if invalid body data', async () => {
            await request(app)
                .post(PAGE_URL + `?id=${validId2}`)
                .send({ 'delete-user-confirm': 'yes' })
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });
    });
});
