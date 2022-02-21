import process from 'process';
import passportCustom from 'passport-custom';
import { Logger } from '@hmcts/nodejs-logging';
import config = require('config');

const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const passport = require('passport');
const authenticationConfig = require('./authentication-config.json');
const CustomStrategy = passportCustom.Strategy;
const logger = Logger.getLogger('authentication');

/**
 * This sets up the OIDC version of authentication, integrating with Azure.
 */
function oidcSetup(): void {
  const clientSecret = config.get('secrets.pip-ss-kv.CLIENT_SECRET') as string;
  logger.info('secret', clientSecret ? clientSecret.substring(0,5) : 'client secret not set!' );
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
    clientSecret: clientSecret,
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
  const findUser = function(user, fn): Function {
    return (user['id'] && user['username']) ? fn(user) : fn(null);
  };

  passport.use('mockaroo', new CustomStrategy(
    function (req, done) {
      const user = req.body;
      findUser(user, function(_user = user) {
        return (user) ? done(null, _user) : done(null, user);
      });
    },
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    findUser(user, function (_user) {
      done(null, _user);
    });
  });
}

/**
 * This function sets up the authentication service
 * Values are read from config, and from the environment passed in
 */
export default function(oidc: string): void {
  if (oidc === 'true') {
    oidcSetup();
  } else {
    mockSetup();
  }
}
