const userId = { userId: '1234', userProvenance: 'PI_AAD', roles: 'VERIFIED' };

describe('Authentication', () => {
    let authentication;
    let passport;
    let expect;
    beforeEach(async () => {
        const authenticationImport = await import('../../../main/authentication/authentication');
        authentication = authenticationImport.default;

        passport = require('passport');

        const chaiImport = await import('chai');
        expect = chaiImport.expect;
    });

    afterEach(() => {
        jest.resetModules();
    });

    const parameters = [{ strategy: 'login' }, { strategy: 'admin-login' }, { strategy: 'media-verification' }];

    it('Should set up passport correctly for azure authentication', () => {
        authentication();
        expect(passport._deserializers).length(1);
        expect(passport._serializers).length(1);
        expect(passport._strategies).to.have.property('login');
        expect(passport._strategies).to.have.property('admin-login');
        expect(passport._strategies).to.have.property('media-verification');
        expect(passport._strategies).to.have.property('cft-idam');

        expect(passport._strategies['login'].name).to.eql('azuread-openidconnect');
        expect(passport._strategies['login']._options.redirectUrl).to.eql(
            'https://pip-frontend.staging.platform.hmcts.net/login/return'
        );
        expect(passport._strategies['admin-login'].name).to.eql('azuread-openidconnect');
        expect(passport._strategies['admin-login']._options.redirectUrl).to.eql(
            'https://pip-frontend.staging.platform.hmcts.net/login/admin/return'
        );
        expect(passport._strategies['media-verification'].name).to.eql('azuread-openidconnect');
        expect(passport._strategies['media-verification']._options.redirectUrl).to.eql(
            'https://pip-frontend.staging.platform.hmcts.net/media-verification/return'
        );
        expect(passport._strategies['cft-idam'].name).to.eql('custom');
    });

    it('Should set up passport correctly for azure authentication when FRONTEND_URL is set', () => {
        process.env.FRONTEND_URL = '';
        authentication();

        expect(passport._serializers).length(1);
        expect(passport._deserializers).length(1);
        expect(passport._strategies).to.have.property('login');
        expect(passport._strategies).to.have.property('admin-login');
        expect(passport._strategies).to.have.property('media-verification');
        expect(passport._strategies).to.have.property('cft-idam');

        expect(passport._strategies['login'].name).to.eql('azuread-openidconnect');
        expect(passport._strategies['login']._options.redirectUrl).to.eql(
            'https://pip-frontend.staging.platform.hmcts.net/login/return'
        );
        expect(passport._strategies['admin-login'].name).to.eql('azuread-openidconnect');
        expect(passport._strategies['admin-login']._options.redirectUrl).to.eql(
            'https://pip-frontend.staging.platform.hmcts.net/login/admin/return'
        );
        expect(passport._strategies['media-verification'].name).to.eql('azuread-openidconnect');
        expect(passport._strategies['media-verification']._options.redirectUrl).to.eql(
            'https://pip-frontend.staging.platform.hmcts.net/media-verification/return'
        );
        expect(passport._strategies['cft-idam'].name).to.eql('custom');
    });

    parameters.forEach(parameter => {
        it(`Test that profile is returned if user is found for Azure AAD ${parameter.strategy} authentication`, async () => {
            const sinon = await import('sinon');
            const AccountManagementRequests = await import(
                '../../../main/resources/requests/accountManagementRequests'
            );
            const stub = sinon.stub(
                AccountManagementRequests.AccountManagementRequests.prototype,
                'getPiUserByAzureOid'
            );
            stub.resolves(userId);

            authentication();

            const strategy = passport._strategies[parameter.strategy];
            const verifyFunction = strategy._verify;
            const profile = { oid: '1234', profile: 'test-profile' };
            const mockCallback = jest.fn();

            await verifyFunction(null, null, profile, null, null, mockCallback);

            expect(mockCallback.mock.calls.length).to.eql(1);
            expect(mockCallback.mock.calls[0][0]).to.eql(null);
            expect(mockCallback.mock.calls[0][1]).to.eql(profile);
        });
    });

    parameters.forEach(parameter => {
        it(`Test that null is returned if no user is found for Azure AAD ${parameter.strategy} authentication`, async () => {
            const sinon = await import('sinon');
            const AccountManagementRequests = await import(
                '../../../main/resources/requests/accountManagementRequests'
            );
            const stub = sinon.stub(
                AccountManagementRequests.AccountManagementRequests.prototype,
                'getPiUserByAzureOid'
            );
            stub.resolves(null);
            authentication();

            const strategy = passport._strategies['login'];
            const verifyFunction = strategy._verify;
            const firstProfile = { oid: '1234', profile: 'test-profile' };
            const mockCallback = jest.fn();

            await verifyFunction(null, null, firstProfile, null, null, mockCallback);

            expect(mockCallback.mock.calls.length).to.eql(1);
            expect(mockCallback.mock.calls[0][0]).to.eql(null);
            expect(mockCallback.mock.calls[0][1]).to.eql(null);
        });
    });

    it('Test that serialising a user for Azure AAD returns their oid and flow', async () => {
        authentication();

        const serializers = passport._serializers;
        const firstSerializer = serializers[0];

        const mockCallback = jest.fn();

        const profile = { oid: '1234' };
        await firstSerializer(profile, mockCallback);

        expect(mockCallback.mock.calls.length).to.eql(1);
        expect(mockCallback.mock.calls[0][0]).to.eql(null);
        expect(mockCallback.mock.calls[0][1]).to.eql({ oid: '1234', flow: 'AAD' });
    });

    it('Test that serialising a user for CFT IDAM where user exists returns their uid and flow', async () => {
        const sinon = await import('sinon');
        const AccountManagementRequests = await import('../../../main/resources/requests/accountManagementRequests');
        const stub = sinon.stub(AccountManagementRequests.AccountManagementRequests.prototype, 'getPiUserByCftID');
        stub.resolves({ userId: '1234' });

        authentication();

        const serializers = passport._serializers;
        const firstSerializer = serializers[0];

        const mockCallback = jest.fn();

        const profile = { uid: '1234', flow: 'CFT' };
        await firstSerializer(profile, mockCallback);

        expect(mockCallback.mock.calls.length).to.eql(1);
        expect(mockCallback.mock.calls[0][0]).to.eql(null);
        expect(stub.calledWith('1234')).to.be.true;
        expect(mockCallback.mock.calls[0][1]).to.eql({ uid: '1234', flow: 'CFT' });
    });

    it('Test that serialising a user for CFT IDAM where user does not exist returns their uid and flow', async () => {
        const sinon = await import('sinon');
        const AccountManagementRequests = await import('../../../main/resources/requests/accountManagementRequests');
        const getUserByIdStub = sinon.stub(
            AccountManagementRequests.AccountManagementRequests.prototype,
            'getPiUserByCftID'
        );
        getUserByIdStub.resolves(null);

        const createUserStub = sinon.stub(
            AccountManagementRequests.AccountManagementRequests.prototype,
            'createPIAccount'
        );
        createUserStub.resolves({});

        const piArgs = [
            {
                userProvenance: 'CFT_IDAM',
                email: 'test@user.com',
                roles: 'VERIFIED',
                provenanceUserId: '1234',
                forenames: 'FirstName',
                surname: 'Surname',
            },
        ];

        authentication();

        const serializers = passport._serializers;
        const firstSerializer = serializers[0];

        const mockCallback = jest.fn();

        const profile = {
            uid: '1234',
            flow: 'CFT',
            sub: 'test@user.com',
            given_name: 'FirstName',
            family_name: 'Surname',
        };
        await firstSerializer(profile, mockCallback);

        expect(mockCallback.mock.calls.length).to.eql(1);
        expect(mockCallback.mock.calls[0][0]).to.eql(null);
        expect(getUserByIdStub.calledWith('1234')).to.be.true;

        const createArgs = createUserStub.getCall(0).args;
        expect(createArgs[0]).to.eql(piArgs);
        expect(createArgs[1]).to.eql('');

        expect(mockCallback.mock.calls[0][1]).to.eql({ uid: '1234', flow: 'CFT' });
    });

    parameters.forEach(parameter => {
        it(`Test that deserialising a user returns user object from the PI user table for Azure AAD ${parameter.strategy} authentication`, async () => {
            const sinon = await import('sinon');
            const AccountManagementRequests = await import(
                '../../../main/resources/requests/accountManagementRequests'
            );
            const stub = sinon.stub(
                AccountManagementRequests.AccountManagementRequests.prototype,
                'getPiUserByAzureOid'
            );
            stub.resolves(userId);

            authentication();

            const firstDeserializer = passport._deserializers[0];
            const serializeMockCallback = jest.fn();

            await firstDeserializer({ oid: '1234', flow: 'AAD' }, serializeMockCallback);

            expect(serializeMockCallback.mock.calls.length).to.eql(1);
            expect(serializeMockCallback.mock.calls[0][0]).to.eql(null);
            expect(serializeMockCallback.mock.calls[0][1]).to.eql(userId);
        });
    });

    it('Test that deserialising a CFT IDAM user returns the user object from the PI User table', async () => {
        const sinon = await import('sinon');
        const AccountManagementRequests = await import('../../../main/resources/requests/accountManagementRequests');
        const stub = sinon.stub(AccountManagementRequests.AccountManagementRequests.prototype, 'getPiUserByCftID');
        stub.resolves(userId);

        authentication();

        const profile = { uid: '1234', flow: 'CFT' };

        const firstDeserializer = passport._deserializers[0];
        const serializeMockCallback = jest.fn();

        await firstDeserializer(profile, serializeMockCallback);

        expect(serializeMockCallback.mock.calls.length).to.eql(1);
        expect(serializeMockCallback.mock.calls[0][0]).to.eql(null);
        expect(serializeMockCallback.mock.calls[0][1]).to.eql(userId);
    });

    parameters.forEach(parameter => {
        it(`Test that the call is read from the env variables when passed in for azure ${parameter.strategy} authentication`, async () => {
            process.env.CLIENT_ID = '2';
            process.env.CLIENT_SECRET = 'client_secret';
            process.env.CONFIG_ENDPOINT = 'https://localhost:8080';
            process.env.CONFIG_ADMIN_ENDPOINT = 'https://localhost:8080';
            process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT = 'https://localhost:8080';

            authentication();
            expect(passport._strategies[parameter.strategy]._options.identityMetadata).to.contain(
                'https://localhost:8080'
            );
            expect(passport._strategies[parameter.strategy]._options.clientID).to.eql('2');
            expect(passport._strategies[parameter.strategy]._options.clientSecret).to.eq('client_secret');
        });
    });
});
