import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { ThirdPartyService } from '../../../main/service/ThirdPartyService';
import sinon from 'sinon';

const userId = 'test-user-123';

const cookie = {
    user: userId,
    createConfig: 'true',
    scope: 'read:data write:data',
    clientId: 'client-123',
    clientSecret: 'secret-456',
    destinationUrl: 'https://auth.example.com',
    tokenUrl: 'https://token.example.com',
};

const oauthConfig = {
    clientId: 'client-id-key',
    clientSecret: 'client-secret-key',
    scopeKey: 'scope-key',
}

const createThirdPartySubscriberOauthConfigStub = sinon.stub(
    ThirdPartyService.prototype,
    'createThirdPartySubscriberOauthConfig'
);
createThirdPartySubscriberOauthConfigStub.withArgs(cookie, '2').resolves(true);
sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriberOauthConfigByUserId').resolves(oauthConfig);

describe('Manage third-party subscriber OAuth config summary page', () => {
    beforeEach(() => {
        app.request['cookies'] = { thirdPartySubscriberCookie: JSON.stringify(cookie) };
    });

    describe('on GET', () => {
        test('should render create third-party subscriber OAuth config summary page', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };

            await request(app)
                .get('/manage-third-party-subscriber-oauth-config-summary')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should render create third-party subscriber OAuth config summary page with errors', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };

            await request(app)
                .post('/manage-third-party-subscriber-oauth-config-summary')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to create third-party subscriber oauth config success page', async () => {
            app.request['user'] = {
                userId: '2',
                roles: 'SYSTEM_ADMIN',
            };

            await request(app)
                .post('/manage-third-party-subscriber-oauth-config-summary')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/manage-third-party-subscriber-oauth-config-success');
                });
        });
    });
});
