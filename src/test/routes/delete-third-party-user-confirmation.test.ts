import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import sinon from 'sinon';
import {AccountManagementRequests} from "../../main/resources/requests/AccountManagementRequests";

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves({provenanceUserId: 'thirdPartyName'})
const deleteUserStub = sinon.stub(AccountManagementRequests.prototype, 'deleteUser');
deleteUserStub.withArgs('123', '1').resolves('success');
deleteUserStub.withArgs('124', '1').resolves(null);

describe('Delete third party user confirmation page', () => {
    app.request['user'] = {
        userId: '1',
        roles: 'SYSTEM_ADMIN',
    };

    describe('on GET', () => {
        test('should render delete third party user confirmation page', async () => {
            await request(app)
                .get('/delete-third-party-user-confirmation')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to delete third party user success page for successful delete user response', async () => {
            app.request['body'] = {
                user: '123',
                'delete-user-confirm': 'yes',
            };

            await request(app)
                .post('/delete-third-party-user-confirmation')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/delete-third-party-user-success');
                });

        });

        test('should render delete third party user confirmation page with error', async () => {
            app.request['body'] = {
                user: '124',
                'delete-user-confirm': 'yes',
            };

            await request(app)
                .post('/delete-third-party-user-confirmation')
                .expect(res => expect(res.status).to.equal(200));

        });

        test('should redirect to manage third party user page for a \'no\' response', async () => {
            app.request['body'] = {
                user: '123',
                'delete-user-confirm': 'no',
            };

            await request(app)
                .post('/delete-third-party-user-confirmation')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/manage-third-party-users/view?userId=123');
                });

        });
    });
});
