import process from 'process';
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const passport = require('passport');

const authenticationConfig = require('./authentication-config.json');

const MockStrategy = require('passport-mock-strategy');

/**
 * This sets up the OIDC version of authentication, integrating with Azure.
 */
function oidcSetup(): void {

  const FRONTEND_URL = process.env.FRONTEND_URL || 'https://pip-frontend.staging.platform.hmcts.net';

  const users = [];

  const findByOid = function(oid, fn): Function {
    for (let i = 0, len = users.length; i < len; i++) {
      const user = users[i];
      if (user.oid === oid) {
        return fn(user);
      }
    }
    return fn(null);
  };

  passport.serializeUser(function(user, done) {
    done(null, user.oid);
  });

  passport.deserializeUser(function(oid, done) {
    findByOid(oid, function (user) {
      done(null, user);
    });
  });

  passport.use(new OIDCStrategy({
    identityMetadata:  authenticationConfig.IDENTITY_METADATA,
    clientID: authenticationConfig.CLIENT_ID,
    responseType: authenticationConfig.RESPONSE_TYPE,
    responseMode: authenticationConfig.RESPONSE_MODE,
    policy: authenticationConfig.POLICY,
    redirectUrl: FRONTEND_URL + '/login/return',
    allowHttpForRedirectUrl: true,
    clientSecret: process.env.CLIENT_SECRET,
    isB2C: true,
  },
  function(iss, sub, profile, accessToken, refreshToken, done) {
    findByOid(profile.oid, function(user) {
      if (!user) {
        // "Auto-registration"
        users.push(profile);
        return done(null, profile);
      }
      return done(null, user);
    });
  },
  ));
}

/**
 * This sets up the local version of authentication, which uses a mock instead.
 */
function mockSetup(): void {

  const mockUser = {'oid': 1234, 'profile': {'oid': '1234'}};

  passport.serializeUser(function(user, done) {
    done(null, user.oid);
  });

  passport.deserializeUser(function(oid, done) {
    return done(null, mockUser);
  });

  passport.use(new MockStrategy({
    name: 'azuread-openidconnect',
    user: mockUser,
  },
  function(user, done) {
    done(null, user);
  },
  ));
}

/**
 * This function sets up the authentication service
 * Values are read from config, and from the environment passed in
 */
export default function(oidc: string): void {
  if (oidc) {
    oidcSetup();
  } else {
    mockSetup();
  }
}

