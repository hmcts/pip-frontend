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

    expect(passport._serializers).length(1);
    expect(passport._deserializers).length(1);
    expect(passport._strategies).to.have.property('azuread-openidconnect');

    console.log(passport);
  });

  it('Should set up passport correctly for mock authentication', () => {
    const passport = require('passport');
    authentication(null);

    expect(passport._serializers).length(1);
    expect(passport._deserializers).length(1);
    expect(passport._strategies).to.have.property('azuread-openidconnect');
  });

  it('Test that a new user is added for azure authentication', () => {
    const passport = require('passport');
    authentication('true');

    const strategy = passport._strategies['azuread-openidconnect'];
    const verifyFunction = strategy._verify;

    const profile = {oid: '1234', profile: 'test-profile'};
    const mockCallback = jest.fn();

    verifyFunction(null, null, profile, null, null, mockCallback);

    expect(mockCallback.mock.calls.length).to.eql(1);
    expect(mockCallback.mock.calls[0][0]).to.eql(null);
    expect(mockCallback.mock.calls[0][1]).to.eql(profile);
  });

  it('Test that if an existing user is found, then that user is returned', () => {
    const passport = require('passport');
    authentication('true');

    const strategy = passport._strategies['azuread-openidconnect'];
    const verifyFunction = strategy._verify;

    const firstProfile = {oid: '1234', profile: 'test-profile'};
    const mockCallback = jest.fn();

    verifyFunction(null, null, firstProfile, null, null, mockCallback);

    const secondProfile = {oid: '1234', profile: 'test-profile2'};

    verifyFunction(null, null, secondProfile, null, null, mockCallback);

    expect(mockCallback.mock.calls.length).to.eql(2);
    expect(mockCallback.mock.calls[1][0]).to.eql(null);
    expect(mockCallback.mock.calls[1][1]).to.eql(firstProfile);
  });

});
