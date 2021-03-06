import sinon from 'sinon';
import {AccountManagementRequests} from '../../../main/resources/requests/accountManagementRequests';

const piUserId = '1234';
sinon.stub(AccountManagementRequests.prototype, 'getPiUserByAzureOid').resolves(piUserId);
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

  it('Should set up passport correctly for azure authentication', () => {
    authentication('true');
    expect(passport._deserializers).length(1);
    expect(passport._serializers).length(1);
    expect(passport._strategies).to.have.property('azuread-openidconnect');
    expect(passport._strategies['azuread-openidconnect']._options.redirectUrl)
      .to.eql('https://pip-frontend.staging.platform.hmcts.net/login/return');
  });

  it('Should set up passport correctly for azure authentication when FRONTEND_URL is set', () => {
    process.env.FRONTEND_URL = '';
    authentication('true');

    expect(passport._serializers).length(1);
    expect(passport._deserializers).length(1);
    expect(passport._strategies).to.have.property('azuread-openidconnect');
    expect(passport._strategies['azuread-openidconnect']._options.redirectUrl)
      .to.eql('https://pip-frontend.staging.platform.hmcts.net/login/return');
  });

  it('Should set up passport correctly for mock authentication', () => {
    authentication(null);

    expect(passport._serializers).length(1);
    expect(passport._deserializers).length(1);
    expect(passport._strategies).to.have.property('mockaroo');
  });

  it('Test that a new user is added for azure authentication', async () => {
    authentication('true');

    const strategy = passport._strategies['azuread-openidconnect'];
    const verifyFunction = strategy._verify;
    const profile = {oid: '1234', profile: 'test-profile'};
    const mockCallback = jest.fn();

    await verifyFunction(null, null, profile, null, null, mockCallback);

    expect(mockCallback.mock.calls.length).to.eql(1);
    expect(mockCallback.mock.calls[0][0]).to.eql(null);
    expect(mockCallback.mock.calls[0][1]).to.eql(profile);
  });

  it('Test that if an existing user is found, then that user is returned', async () => {
    authentication('true');

    const strategy = passport._strategies['azuread-openidconnect'];
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

  it('Test that serialising a user returns their OID', async () => {
    authentication('true');

    const serializers = passport._serializers;
    const firstSerializer = serializers[0];

    const mockCallback = jest.fn();

    const profile = {oid: '1234'};
    await firstSerializer(profile, mockCallback);

    expect(mockCallback.mock.calls.length).to.eql(1);
    expect(mockCallback.mock.calls[0][0]).to.eql(null);
    expect(mockCallback.mock.calls[0][1]).to.eql('1234');
  });

  it('Test that deserialising a user returns the original profile object', async () => {
    authentication('true');

    const strategy = passport._strategies['azuread-openidconnect'];
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

  it('Test that serialising a mock user returns their OID', () => {
    authentication(null);

    const serializers = passport._serializers;
    const firstSerializer = serializers[0];
    const profile = {oid: '1234', profile: 'test-profile'};
    const mockCallback = jest.fn();

    firstSerializer(profile, mockCallback);

    expect(mockCallback.mock.calls.length).to.eql(1);
    expect(mockCallback.mock.calls[0][0]).to.eql(null);
    expect(mockCallback.mock.calls[0][1]).to.eql(profile);
  });

  it('Test that deserializing a mock user returns the user', () => {
    authentication(null);
    const firstDeserializer = passport._deserializers[0];
    const mockCallback = jest.fn();

    firstDeserializer('1234', mockCallback);

    expect(mockCallback.mock.calls.length).to.eql(1);
    expect(mockCallback.mock.calls[0][0]).to.eql(null);
  });

  it('Test that the verify function for passport just returns the user', () => {
    authentication(null);

    const strategy = passport._strategies['mockaroo'];
    const verifyFunction = strategy._verify;
    const mockUserBody = {body: {userName: 'foo', id: 1}};
    const mockCallback = jest.fn();

    verifyFunction(mockUserBody, mockCallback);
    expect(mockCallback.mock.calls.length).to.eql(1);
  });

  it('Test that the call is read from the env variables when passed in', () => {

    process.env.CLIENT_ID = '2';
    process.env.CLIENT_SECRET = 'client_secret';
    process.env.CONFIG_ENDPOINT = 'https://localhost:8080';

    authentication('true');
    expect(passport._strategies['azuread-openidconnect']._options.identityMetadata)
      .to.contain('https://localhost:8080');
    expect(passport._strategies['azuread-openidconnect']._options.clientID)
      .to.eql('2');
    expect(passport._strategies['azuread-openidconnect']._options.clientSecret)
      .to.eq('client_secret');
  });

});
