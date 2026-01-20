import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { ThirdPartyService } from '../../../main/service/ThirdPartyService';
import { ThirdPartyRequests } from '../../../main/resources/requests/ThirdPartyRequests';
import { KeyVaultService } from '../../../main/service/KeyVaultService';
import sinon from 'sinon';

const userId = 'test-user-123';

const cookie = {
    user: userId,
    createConfig: 'true',
    scopeKey: 'TestSubscriber-test-user-123-scope',
    clientIdKey: 'TestSubscriber-test-user-123-client-id',
    clientSecretKey: 'TestSubscriber-test-user-123-client-secret',
    scopeValue: 'read:data write:data',
    clientId: 'client-123',
    clientSecret: 'secret-456',
    destinationUrl: 'https://auth.example.com',
    tokenUrl: 'https://token.example.com',
};

const thirdPartySubscriber = {
    name: 'TestSubscriber',
};

const getThirdPartySubscriberOauthConfigByUserIdStub = sinon.stub(
    ThirdPartyRequests.prototype,
    'getThirdPartySubscriberOauthConfigByUserId'
);
const getThirdPartySubscriberByIdStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriberById');
const validateThirdPartySubscriberOauthConfigFormFieldsStub = sinon.stub(
    ThirdPartyService.prototype,
    'validateThirdPartySubscriberOauthConfigFormFields'
);
const getSecretStub = sinon.stub(KeyVaultService.prototype, 'getSecret');
const createKeyVaultSecretNameStub = sinon.stub(KeyVaultService.prototype, 'createKeyVaultSecretName');

getThirdPartySubscriberOauthConfigByUserIdStub.resolves(cookie);
getThirdPartySubscriberByIdStub.resolves(thirdPartySubscriber);
createKeyVaultSecretNameStub.withArgs('TestSubscriber', userId, 'scope').returns('TestSubscriber-test-user-123-scope');
createKeyVaultSecretNameStub
    .withArgs('TestSubscriber', userId, 'client-id')
    .returns('TestSubscriber-test-user-123-client-id');
createKeyVaultSecretNameStub
    .withArgs('TestSubscriber', userId, 'client-secret')
    .returns('TestSubscriber-test-user-123-client-secret');
getSecretStub.withArgs('TestSubscriber-test-user-123-scope').resolves('read:data write:data');
getSecretStub.withArgs('TestSubscriber-test-user-123-client-id').resolves('client-123');

describe('Manage third party subscriber oauth config page', () => {
    beforeEach(() => {
        app.request['user'] = {
            userId: '1',
            roles: 'SYSTEM_ADMIN',
        };
    });

    describe('on GET', () => {
        test('should render manage third party subscriber oauth config page with existing cookie', async () => {
            app.request['cookies'] = {
                thirdPartySubscriberCookie: JSON.stringify(cookie),
            };

            await request(app)
                .get('/manage-third-party-subscriber-oauth-config')
                .query({ userId: userId })
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });

        test('should render manage third party subscriber oauth config page with new config', async () => {
            app.request['cookies'] = {};
            getThirdPartySubscriberOauthConfigByUserIdStub.resolves(null);

            await request(app)
                .get('/manage-third-party-subscriber-oauth-config')
                .query({ userId: userId })
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });

        test('should render manage third party subscriber oauth config page with existing config from database', async () => {
            app.request['cookies'] = {};
            getThirdPartySubscriberOauthConfigByUserIdStub.resolves(cookie);

            await request(app)
                .get('/manage-third-party-subscriber-oauth-config')
                .query({ userId: userId })
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });
    });

    describe('on POST', () => {
        test('should render manage third party subscriber oauth config page with errors', async () => {
            const formErrors = { destinationUrl: 'Destination URL is required' };
            validateThirdPartySubscriberOauthConfigFormFieldsStub.returns(formErrors);

            await request(app)
                .post('/manage-third-party-subscriber-oauth-config')
                .send({
                    destinationUrl: '',
                    tokenUrl: 'https://token.example.com',
                })
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });

        test('should redirect to summary page when form is valid', async () => {
            validateThirdPartySubscriberOauthConfigFormFieldsStub.returns(null);

            await request(app)
                .post('/manage-third-party-subscriber-oauth-config')
                .send(cookie)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/manage-third-party-subscriber-oauth-config-summary');
                });
        });
    });
});
