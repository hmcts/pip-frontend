import process from 'process';
import passportCustom from 'passport-custom';
import { Logger } from '@hmcts/nodejs-logging';
import config = require('config');
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';

const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const passport = require('passport');
const authenticationConfig = require('./authentication-config.json');
const CustomStrategy = passportCustom.Strategy;
const logger = Logger.getLogger('authentication');

const accountRequests = new AccountManagementRequests();

/**
 * This sets up the OIDC version of authentication, integrating with Azure.
 */
function oidcSetup(): void {
  let clientSecret;
  let clientId;
  let identityMetadata;

  if(process.env.CLIENT_SECRET) {
    clientSecret = process.env.CLIENT_SECRET;
  } else {
    clientSecret = config.get('secrets.pip-ss-kv.CLIENT_SECRET') as string;
  }

  if(process.env.CLIENT_ID) {
    clientId = process.env.CLIENT_ID;
  } else {
    clientId = config.get('secrets.pip-ss-kv.CLIENT_ID') as string;
  }

  if(process.env.CONFIG_ENDPOINT) {
    identityMetadata = process.env.CONFIG_ENDPOINT;
  } else {
    identityMetadata = config.get('secrets.pip-ss-kv.CONFIG_ENDPOINT') as string;
  }

  logger.info('secret', clientSecret ? clientSecret.substring(0,5) : 'client secret not set!' );

  const AUTH_RETURN_URL = process.env.AUTH_RETURN_URL || 'https://pip-frontend.staging.platform.hmcts.net/login/return';
  const users = [];

  const findByOid = async function(oid, fn): Promise<Function> {
    for (let i = 0, len = users.length; i < len; i++) {
      const user = users[i];
      if (user.oid === oid) {
        user['piUserId'] = await accountRequests.getPiUserByAzureOid(oid);
        return fn(user);
      }
    }
    return fn(null);
  };

  passport.serializeUser(function(user, done) {
    done(null, user.oid);
  });

  passport.deserializeUser(async function(oid, done) {
    await findByOid(oid, function (user) {
      done(null, user);
    });
  });

  passport.use(new OIDCStrategy({
    identityMetadata:  identityMetadata,
    clientID: clientId,
    responseType: authenticationConfig.RESPONSE_TYPE,
    responseMode: authenticationConfig.RESPONSE_MODE,
    policy: authenticationConfig.POLICY,
    redirectUrl: AUTH_RETURN_URL,
    allowHttpForRedirectUrl: true,
    clientSecret: clientSecret,
    isB2C: true,
  },
  async function(iss, sub, profile, accessToken, refreshToken, done) {
    await findByOid(profile.oid, function(user) {
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
