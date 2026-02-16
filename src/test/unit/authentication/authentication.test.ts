import { piAadVerifyFunction } from '../../../main/authentication/b2cAuthentication';
import { ssoVerifyFunction } from '../../../main/authentication/ssoAuthentication';

const userId = { userId: '1234', userProvenance: 'PI_AAD', roles: 'VERIFIED' };
const ssoUserProfile = {
    oid: '1234',
    _json: { preferred_username: 'test@test.com' },
    email: 'test@test.com',
    roles: 'SYSTEM_ADMIN',
    flow: 'SSO',
};

const mockConfig = {
    config: {},
    callbackURL: 'mock-callback-url',
    scope: 'mock-scope',
};

describe('Authentication', () => {
    let authentication;
    let passport;
    let expect;
    beforeEach(async () => {
        const authenticationImport = await import('../../../main/authentication/authentication');
        authentication = authenticationImport.oidcSetup;

        passport = await import('passport');

        const chaiImport = await import('chai');
        expect = chaiImport.expect;

        const mockFunctionFromOidcConstructor = (options, callback) => {
            return {
                options: options,
                callbackFunction: callback,
            };
        };

        jest.mock('../../../main/authentication/extendedOidcStrategy', () => {
            return {
                OIDCStrategy: jest.fn().mockImplementation((config, callback) => {
                    return mockFunctionFromOidcConstructor(config, callback);
                }),
            };
        });

        const b2cAuthentication = await import('../../../main/authentication/b2cAuthentication');

        // @ts-ignore Unneeded config
        jest.spyOn(b2cAuthentication, 'getB2cConfig').mockResolvedValue(mockConfig);
        // @ts-ignore Unneeded config
        jest.spyOn(b2cAuthentication, 'getB2cMediaVerificationConfig').mockResolvedValue(mockConfig);

        const ssoAuthentication = await import('../../../main/authentication/ssoAuthentication');

        // @ts-ignore Unneeded config
        jest.spyOn(ssoAuthentication, 'getSsoConfig').mockResolvedValue(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });

    const parameters = [{ strategy: 'login' }, { strategy: 'media-verification' }];

    it('Should set up passport oidc strategies for authentication', async () => {
        await authentication();
        expect(passport._deserializers).length(1);
        expect(passport._serializers).length(1);
        expect(passport._strategies).to.have.property('login');
        expect(passport._strategies).to.have.property('media-verification');
        expect(passport._strategies).to.have.property('cft-idam');

        expect(passport._strategies['login'].options).to.eq(mockConfig);
        expect(passport._strategies['media-verification'].options).to.eql(mockConfig);
        expect(passport._strategies['sso'].options).to.eql(mockConfig);

        expect(passport._strategies['login'].callbackFunction).to.eq(piAadVerifyFunction);
        expect(passport._strategies['media-verification'].callbackFunction).to.eql(piAadVerifyFunction);
        expect(passport._strategies['sso'].callbackFunction).to.eql(ssoVerifyFunction);
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
        const AccountManagementRequests = await import('../../../main/resources/requests/AccountManagementRequests');
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
        const AccountManagementRequests = await import('../../../main/resources/requests/AccountManagementRequests');
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

    it('Test that serialising a user for Crime IDAM where user exists returns their uid and flow', async () => {
        const sinon = await import('sinon');
        const AccountManagementRequests = await import('../../../main/resources/requests/AccountManagementRequests');
        const stub = sinon.stub(AccountManagementRequests.AccountManagementRequests.prototype, 'getPiUserByCrimeID');
        stub.resolves({ userId: '1234' });

        authentication();

        const serializers = passport._serializers;
        const firstSerializer = serializers[0];

        const mockCallback = jest.fn();

        const profile = { subname: '1234', flow: 'Crime' };
        await firstSerializer(profile, mockCallback);

        expect(mockCallback.mock.calls.length).to.eql(1);
        expect(mockCallback.mock.calls[0][0]).to.eql(null);
        expect(stub.calledWith('1234')).to.be.true;
        expect(mockCallback.mock.calls[0][1]).to.eql({ uid: '1234', flow: 'Crime' });
    });

    it('Test that serialising a user for Crime IDAM where user does not exist returns their uid and flow', async () => {
        const sinon = await import('sinon');
        const AccountManagementRequests = await import('../../../main/resources/requests/AccountManagementRequests');
        const getUserByIdStub = sinon.stub(
            AccountManagementRequests.AccountManagementRequests.prototype,
            'getPiUserByCrimeID'
        );
        getUserByIdStub.resolves(null);

        const createUserStub = sinon.stub(
            AccountManagementRequests.AccountManagementRequests.prototype,
            'createPIAccount'
        );
        createUserStub.resolves({});

        const piArgs = [
            {
                userProvenance: 'CRIME_IDAM',
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
            subname: '1234',
            flow: 'Crime',
            email: 'test@user.com',
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

        expect(mockCallback.mock.calls[0][1]).to.eql({ uid: '1234', flow: 'Crime' });
    });

    it('Test serialising a SSO user', async () => {
        authentication();

        const serializers = passport._serializers;
        const firstSerializer = serializers[0];

        const mockCallback = jest.fn();
        await firstSerializer(ssoUserProfile, mockCallback);

        expect(mockCallback.mock.calls.length).to.eql(1);
        expect(mockCallback.mock.calls[0][0]).to.eql(null);
        expect(mockCallback.mock.calls[0][1]).to.eql({ oid: '1234', flow: 'SSO' });
    });

    parameters.forEach(parameter => {
        it(`Test that deserialising a user returns user object from the PI user table for Azure AAD ${parameter.strategy} authentication`, async () => {
            const sinon = await import('sinon');
            const AccountManagementRequests = await import(
                '../../../main/resources/requests/AccountManagementRequests'
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
        const AccountManagementRequests = await import('../../../main/resources/requests/AccountManagementRequests');
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

    it('Test that deserialising a Crime IDAM user returns the user object from the PI User table', async () => {
        const sinon = await import('sinon');
        const AccountManagementRequests = await import('../../../main/resources/requests/AccountManagementRequests');
        const stub = sinon.stub(AccountManagementRequests.AccountManagementRequests.prototype, 'getPiUserByCrimeID');
        stub.resolves(userId);

        authentication();

        const profile = { uid: '1234', flow: 'Crime' };

        const firstDeserializer = passport._deserializers[0];
        const serializeMockCallback = jest.fn();

        await firstDeserializer(profile, serializeMockCallback);

        expect(serializeMockCallback.mock.calls.length).to.eql(1);
        expect(serializeMockCallback.mock.calls[0][0]).to.eql(null);
        expect(serializeMockCallback.mock.calls[0][1]).to.eql(userId);
    });

    it('Test that deserialising a SSO user returns the user object from the PI User table', async () => {
        const sinon = await import('sinon');
        const AccountManagementRequests = await import('../../../main/resources/requests/AccountManagementRequests');
        const stub = sinon.stub(AccountManagementRequests.AccountManagementRequests.prototype, 'getPiUserByAzureOid');
        stub.resolves(userId);

        authentication();

        const firstDeserializer = passport._deserializers[0];
        const serializeMockCallback = jest.fn();
        await firstDeserializer(ssoUserProfile, serializeMockCallback);

        expect(serializeMockCallback.mock.calls.length).to.eql(1);
        expect(serializeMockCallback.mock.calls[0][0]).to.eql(null);
        expect(serializeMockCallback.mock.calls[0][1]).to.eql(userId);
    });
});
