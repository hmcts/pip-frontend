import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../main/resources/requests/accountManagementRequests';

const PAGE_URL = '/delete-user-confirmation';

const stub = sinon.stub(AccountManagementRequests.prototype, 'deleteUser');
const validBody = { 'delete-user-confirm': 'yes', user: '123' };
const invalidBody = { 'delete-user-confirm': 'yes', user: 'foo' };
const redirectBody = { 'delete-user-confirm': 'no', user: '1234' };

describe('Delete User Confirmation', () => {
    beforeEach(() => {
        stub.withArgs('123').resolves(true);
        stub.withArgs('foo').resolves(undefined);
        app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
    });

    describe('on POST', () => {
        test('should redirect to manage user if there is no body data', async () => {
            await request(app)
                .post(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/manage-user?id=undefined');
                });
        });

        test('should redirect to manage user if delete-user-confirm value is no', async () => {
            await request(app)
                .post(PAGE_URL)
                .send(redirectBody)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/manage-user?id=1234');
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
