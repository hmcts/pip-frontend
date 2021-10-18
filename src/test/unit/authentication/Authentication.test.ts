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

});
