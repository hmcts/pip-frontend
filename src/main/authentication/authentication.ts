import process from 'process';
import { Logger } from '@hmcts/nodejs-logging';
import config = require('config');
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {AUTH_RETURN_URL, MEDIA_VERIFICATION_RETURN_URL, ADMIN_AUTH_RETURN_URL} from '../helpers/envUrls';

const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const passport = require('passport');
const authenticationConfig = require('./authentication-config.json');
const logger = Logger.getLogger('authentication');

/**
 * This sets up the OIDC version of authentication, integrating with Azure.
 */
function oidcSetup(): void {
  let clientSecret;
  let clientId;
  let identityMetadata;
  let adminIdentityMetadata;
  let mediaVerificationIdentityMetadata;

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

  if(process.env.CONFIG_ADMIN_ENDPOINT) {
    adminIdentityMetadata = process.env.CONFIG_ADMIN_ENDPOINT;
  } else {
    adminIdentityMetadata = config.get('secrets.pip-ss-kv.CONFIG_ADMIN_ENDPOINT') as string;
  }

  if(process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT) {
    mediaVerificationIdentityMetadata = process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT;
  } else {
    mediaVerificationIdentityMetadata = config.get('secrets.pip-ss-kv.MEDIA_VERIFICATION_CONFIG_ENDPOINT') as string;
  }

  logger.info('secret', clientSecret ? clientSecret.substring(0,5) : 'client secret not set!' );

  const users = [];

  const findByOid = async function(oid, fn): Promise<any> {
    for (let i = 0, len = users.length; i < len; i++) {
      const user = users[i];
      if (user.oid === oid) {
        const returnedUser = await AccountManagementRequests.prototype.getPiUserByAzureOid(oid);
        user['piUserId'] = returnedUser.userId;
        user['piUserProvenance'] = returnedUser.userProvenance;
        return fn(user);
      }
    }
    return fn(null);
  };

  const passportStrategyFn = async function(iss, sub, profile, accessToken, refreshToken, done): Promise<any> {
    await findByOid(profile.oid, function(user) {
      if (!user) {
        // "Auto-registration"
        users.push(profile);
        return done(null, profile);
      }
      return done(null, user);
    });
  };

  passport.serializeUser(function(user, done) {
    done(null, user.oid);
  });

  passport.deserializeUser(async function(oid, done) {
    await findByOid(oid, function (user) {
      done(null, user);
    });
  });

  passport.use('login', new OIDCStrategy({
    identityMetadata:  identityMetadata,
    clientID: clientId,
    responseType: authenticationConfig.RESPONSE_TYPE,
    responseMode: authenticationConfig.RESPONSE_MODE,
    redirectUrl: AUTH_RETURN_URL,
    allowHttpForRedirectUrl: true,
    clientSecret: clientSecret,
    isB2C: true,
  },
  passportStrategyFn,
  ));

  passport.use('admin-login', new OIDCStrategy({
    identityMetadata:  adminIdentityMetadata,
    clientID: clientId,
    responseType: authenticationConfig.RESPONSE_TYPE,
    responseMode: authenticationConfig.RESPONSE_MODE,
    redirectUrl: ADMIN_AUTH_RETURN_URL,
    allowHttpForRedirectUrl: true,
    clientSecret: clientSecret,
    isB2C: true,
  },
  passportStrategyFn,
  ));

  passport.use('media-verification', new OIDCStrategy({
    identityMetadata:  mediaVerificationIdentityMetadata,
    clientID: clientId,
    responseType: authenticationConfig.RESPONSE_TYPE,
    responseMode: authenticationConfig.RESPONSE_MODE,
    redirectUrl: MEDIA_VERIFICATION_RETURN_URL,
    allowHttpForRedirectUrl: true,
    clientSecret: clientSecret,
    isB2C: true,
  },
  passportStrategyFn,
  ));
}

/**
 * This function sets up the authentication service
 * Values are read from config, and from the environment passed in
 */
export default function(): void {
  oidcSetup();
}
