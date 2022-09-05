const piUserId = {piUserId: '1234', piUserProvenance: 'PI_AAD'};

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

  const parameters = [
    { strategy: 'login' },
    { strategy: 'admin-login' },
    { strategy: 'media-verification' },
  ];

  it('Should set up passport correctly for azure authentication', () => {
    authentication();
    expect(passport._deserializers).length(1);
    expect(passport._serializers).length(1);
    expect(passport._strategies).to.have.property('login');
    expect(passport._strategies).to.have.property('admin-login');
    expect(passport._strategies).to.have.property('media-verification');

    expect(passport._strategies['login'].name).to.eql('azuread-openidconnect');
    expect(passport._strategies['login']._options.redirectUrl)
      .to.eql('https://pip-frontend.staging.platform.hmcts.net/login/return');
    expect(passport._strategies['admin-login'].name).to.eql('azuread-openidconnect');
    expect(passport._strategies['admin-login']._options.redirectUrl)
      .to.eql('https://pip-frontend.staging.platform.hmcts.net/login/return');
    expect(passport._strategies['media-verification'].name).to.eql('azuread-openidconnect');
    expect(passport._strategies['media-verification']._options.redirectUrl)
      .to.eql('https://pip-frontend.staging.platform.hmcts.net/media-verification/return');
  });

  it('Should set up passport correctly for azure authentication when FRONTEND_URL is set', () => {
    process.env.FRONTEND_URL = '';
    authentication();

    expect(passport._serializers).length(1);
    expect(passport._deserializers).length(1);
    expect(passport._strategies).to.have.property('login');
    expect(passport._strategies).to.have.property('admin-login');
    expect(passport._strategies).to.have.property('media-verification');

    expect(passport._strategies['login'].name).to.eql('azuread-openidconnect');
    expect(passport._strategies['login']._options.redirectUrl)
      .to.eql('https://pip-frontend.staging.platform.hmcts.net/login/return');
    expect(passport._strategies['admin-login'].name).to.eql('azuread-openidconnect');
    expect(passport._strategies['admin-login']._options.redirectUrl)
      .to.eql('https://pip-frontend.staging.platform.hmcts.net/login/return');
    expect(passport._strategies['media-verification'].name).to.eql('azuread-openidconnect');
    expect(passport._strategies['media-verification']._options.redirectUrl)
      .to.eql('https://pip-frontend.staging.platform.hmcts.net/media-verification/return');
  });

  parameters.forEach((parameter) => {
    it(`Test that a new user is added for azure ${parameter.strategy} authentication`, async () => {
      authentication();

      const strategy = passport._strategies[parameter.strategy];
      const verifyFunction = strategy._verify;
      const profile = {oid: '1234', profile: 'test-profile'};
      const mockCallback = jest.fn();

      await verifyFunction(null, null, profile, null, null, mockCallback);

      expect(mockCallback.mock.calls.length).to.eql(1);
      expect(mockCallback.mock.calls[0][0]).to.eql(null);
      expect(mockCallback.mock.calls[0][1]).to.eql(profile);
    });
  });

  parameters.forEach((parameter) => {
    it(`Test that if an existing user is found, then that user is returned for azure ${parameter.strategy} authentication`, async () => {
      const sinon = await import('sinon');
      const AccountManagementRequests = await import('../../../main/resources/requests/accountManagementRequests');
      const stub = sinon.stub(AccountManagementRequests.AccountManagementRequests.prototype, 'getPiUserByAzureOid');
      stub.resolves(piUserId);
      authentication();

      const strategy = passport._strategies['login'];
      const verifyFunction = strategy._verify;
      const firstProfile = {oid: '1234', profile: 'test-profile'};
      const mockCallback = jest.fn();

      await verifyFunction(null, null, firstProfile, null, null, mockCallback);

      const secondProfile = {oid: '1234', profile: 'test-profile2'};

      await verifyFunction(null, null, secondProfile, null, null, mockCallback);

      expect(mockCallback.mock.calls.length).to.eql(2);
      expect(mockCallback.mock.calls[1][0]).to.eql(null);
      expect(mockCallback.mock.calls[1][1]).to.eql(firstProfile);
    });
  });

  it('Test that serialising a user returns their OID', async () => {
    authentication();

    const serializers = passport._serializers;
    const firstSerializer = serializers[0];

    const mockCallback = jest.fn();

    const profile = {oid: '1234'};
    await firstSerializer(profile, mockCallback);

    expect(mockCallback.mock.calls.length).to.eql(1);
    expect(mockCallback.mock.calls[0][0]).to.eql(null);
    expect(mockCallback.mock.calls[0][1]).to.eql('1234');
  });

  parameters.forEach((parameter) => {
    it(`Test that deserialising a user returns the original profile object for azure ${parameter.strategy} authentication`, async () => {
      const sinon = await import('sinon');
      const AccountManagementRequests = await import('../../../main/resources/requests/accountManagementRequests');
      const stub = sinon.stub(AccountManagementRequests.AccountManagementRequests.prototype, 'getPiUserByAzureOid');
      stub.resolves(piUserId);

      authentication();

      const strategy = passport._strategies[parameter.strategy];
      const verifyFunction = strategy._verify;
      const profile = {oid: '1234', profile: 'test-profile'};
      const verifyMockCallback = jest.fn();

      await verifyFunction(null, null, profile, null, null, verifyMockCallback);
      const firstDeserializer = passport._deserializers[0];
      const serializeMockCallback = jest.fn();

      await firstDeserializer('1234', serializeMockCallback);

      expect(serializeMockCallback.mock.calls.length).to.eql(1);
      expect(serializeMockCallback.mock.calls[0][0]).to.eql(null);
      expect(serializeMockCallback.mock.calls[0][1]).to.eql(profile);
    });
  });

  parameters.forEach((parameter) => {
    it(`Test that the call is read from the env variables when passed in for azure ${parameter.strategy} authentication`, async () => {
      process.env.CLIENT_ID = '2';
      process.env.CLIENT_SECRET = 'client_secret';
      process.env.CONFIG_ENDPOINT = 'https://localhost:8080';
      process.env.CONFIG_ADMIN_ENDPOINT = 'https://localhost:8080';
      process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT = 'https://localhost:8080';

      authentication();
      expect(passport._strategies[parameter.strategy]._options.identityMetadata)
        .to.contain('https://localhost:8080');
      expect(passport._strategies[parameter.strategy]._options.clientID)
        .to.eql('2');
      expect(passport._strategies[parameter.strategy]._options.clientSecret)
        .to.eq('client_secret');
    });
  });
});
